import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = "https://wnyeuaasktaknlvcoypo.supabase.co";
const SUPABASE_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueWV1YWFza3Rha25sdmNveXBvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY5MjEyMiwiZXhwIjoyMDk2MjY4MTIyfQ.e7_C6VgUmAKZzhCkCBK_myPPPJAUQ6-M3hNP2zf-LR4";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
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
