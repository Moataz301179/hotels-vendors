import { verifyActivationToken } from "@/lib/supplier/shell-onboard";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export interface HydrationPayload {
  activationToken: string;
  passwordRaw: string;
  bankAccountRef: string;
  bankName: string;
}

export class OnboardingHydrator {
  /**
   * The Growth Loop Activation Pipeline
   * Formal token exchange handler converting tokenized 'Shell Accounts' into fully 
   * verified, operational platform tenancies.
   */
  public async executeHydrationProtocol(payload: HydrationPayload) {
    const { activationToken, passwordRaw, bankAccountRef, bankName } = payload;

    // 1. Ingest and cryptographically verify the activation token
    const decoded = await verifyActivationToken(activationToken);
    if (!decoded) {
      throw new Error("ACTIVATION_BREACH: The shell activation token is invalid, corrupted, or cryptographically expired.");
    }

    const { supplierId, tenantId } = decoded;

    // 2. Lock historical ledger records and assert shell account existence
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId, tenantId },
      include: { hotelMandates: true }
    });

    if (!supplier) {
      throw new Error("ORPHANED_SHELL_EXCEPTION: Referenced shell account historical ledger does not exist.");
    }

    if (supplier.status === "ACTIVE") {
      throw new Error("HYDRATION_REDUNDANCY: Shell account has already been transitioned to an operational tenancy.");
    }

    // 3. Perform atomic state transition binding cryptographic credentials
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(passwordRaw, salt);

    const result = await prisma.$transaction(async (tx) => {
      // Resolve or instantiate the primary Owner authority role for the tenant hierarchy
      let ownerRole = await tx.role.findFirst({
        where: { name: "Owner", tenantId },
      });

      if (!ownerRole) {
        ownerRole = await tx.role.create({
          data: { name: "Owner", tenantId, isGlobal: false },
        });
      }

      // A. Hydrate the active cryptographic user credential
      const user = await tx.user.create({
        data: {
          name: supplier.name,
          email: supplier.email,
          passwordHash,
          role: "OWNER",
          platformRole: "SUPPLIER",
          status: "ACTIVE",
          tenantId,
          roleId: ownerRole.id,
          supplierId: supplier.id
        },
      });

      // B. Transition HotelSupplier relationships to ACTIVE operational flag
      await tx.hotelSupplier.updateMany({
        where: { supplierId, tenantId },
        data: {
          isShell: false,
          activatedAt: new Date(),
        },
      });

      // C. Transition the Supplier Root Ledger operational state
      const operationalSupplier = await tx.supplier.update({
        where: { id: supplierId },
        data: {
          status: "ACTIVE",
          bankAccount: bankAccountRef,
          bankName: bankName,
        },
      });

      // D. Commit immutable state transition to AuditLog
      await tx.auditLog.create({
        data: {
          action: "SHELL_ACCOUNT_HYDRATED",
          entityType: "SUPPLIER",
          entityId: supplierId,
          actorId: user.id,
          tenantId,
          afterState: JSON.stringify({
            supplierId,
            activatedAt: new Date().toISOString(),
            bankName,
            status: "ACTIVE"
          }),
        },
      });

      return { user, supplier: operationalSupplier };
    });

    console.log(`[Hydration Telemetry] Growth Loop executed successfully. Shell account '${result.supplier.name}' cleanly bound to historical ledger history.`);
    return result;
  }
}
