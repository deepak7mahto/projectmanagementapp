import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "~/utils/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // Fetch all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, displayName, email")
      .order("displayName");

    if (profilesError) throw profilesError;

    res.status(200).json(profiles);
  } catch (error: any) {
    console.error("DEBUG: API error:", error);
    res.status(500).json({
      error: error.message || JSON.stringify(error) || "Internal server error",
    });
  }
}
