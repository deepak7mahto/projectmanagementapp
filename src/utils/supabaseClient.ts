import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (process.env.NEXT_PUBLIC_SUPABASE_URL as string) ||
  (process.env.SUPABASE_URL as string);
const supabaseAnonKey =
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string) ||
  (process.env.SUPABASE_ANON_KEY as string);

const supabaseServiceKey =
  (process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY as string) ||
  (process.env.SUPABASE_SERVICE_ROLE_KEY as string);

console.log("supabaseUrl", supabaseUrl);
console.log("supabaseAnonKey", supabaseAnonKey);
console.log("supabaseServiceKey", supabaseServiceKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
