import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase admin environment variables are not set. Check SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL.");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
