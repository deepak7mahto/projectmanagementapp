import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// Use service role key for admin access
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("DEBUG: SUPABASE_URL:", supabaseUrl);
console.log(
  "DEBUG: SUPABASE_SERVICE_ROLE_KEY (first 5 chars):",
  supabaseServiceRoleKey ? supabaseServiceRoleKey.slice(0, 5) : "undefined",
);

const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // DEBUG: Try a minimal admin API call
    try {
      const adminTest = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1,
      });
      console.log(
        "DEBUG: admin.listUsers() result:",
        JSON.stringify(adminTest, null, 2),
      );
    } catch (adminErr) {
      console.error("DEBUG: admin.listUsers() error:", adminErr);
    }

    // Fetch all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .order("full_name");
    if (profilesError) throw profilesError;

    // Fetch all user emails from auth.users (admin API)
    const { data: usersData, error: usersError } =
      await supabase.auth.admin.listUsers();
    if (usersError) throw usersError;
    const emails = usersData.users.map((user: any) => ({
      id: user.id,
      email: user.email,
    }));
    const emailMap = new Map(emails.map((u) => [u.id, u.email]));

    // Merge profiles and emails by id
    const merged = profiles.map((profile: any) => ({
      ...profile,
      email: emailMap.get(profile.id) || "",
    }));

    res.status(200).json(merged);
  } catch (error: any) {
    console.error("DEBUG: API error:", error);
    res
      .status(500)
      .json({
        error:
          error.message || JSON.stringify(error) || "Internal server error",
      });
  }
}
