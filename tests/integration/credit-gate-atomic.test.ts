import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));
import {
  checkAndReserveCredit,
  CREDIT_EXCEEDED_ERROR,
} from "@/lib/credit-gate";

/**
 * Fake transaction client that simulates a serialized DB:
 * - records every operation in sequence
 * - $queryRaw handles the tagged template SELECT ... FOR UPDATE
 */
function makeFakeTx(creditLimit: number | null, initialUsed: number) {
  let creditUsed = initialUsed;
  const ops: string[] = [];

  const tx = {
    ops,
    get creditUsed() {
      return creditUsed;
    },
    $queryRaw: async (
      strings: TemplateStringsArray,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...values: any[]
    ) => {
      const sql = strings.join("?").replace(/\?/g, String(values.shift()));
      ops.push(sql);
      if (!sql.includes("FOR UPDATE")) {
        throw new Error(
          "RACE CONDITION: credit row read without FOR UPDATE lock"
        );
      }
      return [{ creditLimit, creditUsed }];
    },
    hotel: {
      findUnique: async () => {
        ops.push("findUnique(no-lock)");
        return { creditLimit, creditUsed };
      },
      update: async ({
        data,
      }: {
        data: { creditUsed: { increment: number } };
      }) => {
        ops.push(`update.creditUsed.increment:${data.creditUsed.increment}`);
        creditUsed += Number(data.creditUsed.increment);
        return {};
      },
    },
  };
  return tx;
}

describe("credit gate - atomic check-and-reserve (SELECT FOR UPDATE)", () => {
  it("locks the row with FOR UPDATE before reading credit", async () => {
    const tx = makeFakeTx(100000, 50000);
    await checkAndReserveCredit(tx as never, "hotel_1", 10000);
    const lockQuery = tx.ops.find((o) => o.includes("FOR UPDATE"));
    expect(lockQuery).toBeDefined();
    expect(tx.ops.indexOf(lockQuery!)).toBeLessThan(
      tx.ops.findIndex((o) => o.startsWith("update"))
    );
    expect(tx.creditUsed).toBe(60000);
  });

  it("allows an order exactly at the remaining limit", async () => {
    const tx = makeFakeTx(100000, 90000);
    await checkAndReserveCredit(tx as never, "hotel_1", 10000);
    expect(tx.creditUsed).toBe(100000);
  });

  it("rejects and does NOT increment when over the limit", async () => {
    const tx = makeFakeTx(100000, 95000);
    await expect(
      checkAndReserveCredit(tx as never, "hotel_1", 10000)
    ).rejects.toBeInstanceOf(CREDIT_EXCEEDED_ERROR);
    expect(tx.creditUsed).toBe(95000);
    expect(tx.ops.some((o) => o.startsWith("update"))).toBe(false);
  });

  it("rejects on a maxed-out account", async () => {
    const tx = makeFakeTx(100000, 100000);
    await expect(
      checkAndReserveCredit(tx as never, "hotel_1", 0.01)
    ).rejects.toBeInstanceOf(CREDIT_EXCEEDED_ERROR);
    expect(tx.creditUsed).toBe(100000);
  });

  it("simulated concurrency: two concurrent reservations cannot both pass", async () => {
    // Shared row state + a row lock that mimics FOR UPDATE semantics:
    // once a transaction locks the row, others block until it commits.
    let creditUsed = 90000;
    const limit = 100000;
    let lockOwner: symbol | null = null;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const makeSharedTx = () => {
      const id = Symbol();
      return {
         
        $queryRaw: async () => {
          while (lockOwner !== null && lockOwner !== id) await sleep(1);
          if (lockOwner === null) {
            lockOwner = id;
            await sleep(5); // hold the lock across the rest of the tx
          }
          return [{ creditLimit: limit, creditUsed }];
        },
        hotel: {
          update: async ({
            data,
          }: {
            data: { creditUsed: { increment: number } };
          }) => {
            creditUsed += Number(data.creditUsed.increment);
            lockOwner = null; // commit releases the lock
          },
        },
      };
    };

    const results = await Promise.allSettled([
      checkAndReserveCredit(makeSharedTx() as never, "h", 8000),
      checkAndReserveCredit(makeSharedTx() as never, "h", 8000),
    ]);

    const fulfilled = results.filter((r) => r.status === "fulfilled").length;
    expect(fulfilled).toBe(1); // exactly one fits in the 10k headroom
    expect(creditUsed).toBeLessThanOrEqual(limit); // limit never breached
  });

  it("throws plain error for missing hotel", async () => {
    const tx = makeFakeTx(100000, 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (tx.$queryRaw as any) = async () => [];
    await expect(
      checkAndReserveCredit(tx as never, "ghost", 100)
    ).rejects.toThrow(/not found/i);
  });
});
