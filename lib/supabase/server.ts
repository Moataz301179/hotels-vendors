import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

class SupabaseMockBuilder {
  private data: any[] = [];
  constructor(data: any[] = []) {
    this.data = data;
  }
  select() { return this; }
  order() { return this; }
  limit() { return this; }
  eq() { return this; }
  neq() { return this; }
  gt() { return this; }
  gte() { return this; }
  lt() { return this; }
  lte() { return this; }
  like() { return this; }
  ilike() { return this; }
  in() { return this; }
  or() { return this; }
  and() { return this; }
  not() { return this; }
  textSearch() { return this; }
  then(resolve: (value: { data: any[]; error: null }) => void) {
    resolve({ data: this.data, error: null });
  }
  catch() { return this; }
}

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.warn("[Supabase] NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY not set. Returning mock client.");
    return {
      from: () => ({
        select: () => new SupabaseMockBuilder([]),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
        upsert: () => Promise.resolve({ data: null, error: null }),
      }),
      rpc: () => Promise.resolve({ data: null, error: null }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      },
    } as any;
  }
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component — cookies may not be writable
        }
      },
    },
  });
}