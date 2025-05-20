import { supabase } from "./supabaseClient";

// TypeScript types matching your schema
type Profile = {
  id: string;
  displayName: string;
  created_at: string;
  full_name?: string;
  bio?: string;
  phone?: string;
  location?: string;
  job_title?: string;
  github_url?: string;
  linkedin_url?: string;
};

// Get all user profiles
export async function getAllProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, displayName")
    .order("displayName");

  if (error) throw error;
  return data as { id: string; displayName: string }[];
}

// Get a profile by ID
export async function getProfileById(id: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("No profile found for the given id.");
  return data as Profile;
}

// Update a profile
export async function updateProfile(
  id: string,
  updates: Partial<Omit<Profile, "id" | "created_at">>,
) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}
