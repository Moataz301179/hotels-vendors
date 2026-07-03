import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = "https://wnyeuaasktaknlvcoypo.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueWV1YWFza3Rha25sdmNveXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2OTIxMjIsImV4cCI6MjA5NjI2ODEyMn0.Pc-us4RzUsKGxGQMbjsr5naTmRTP0ru3ooEx5mr1_dQ";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
