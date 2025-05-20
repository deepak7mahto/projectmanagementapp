import { supabase } from "./supabaseClient";

// TypeScript types matching your schema
type Profile = {
  id: string;
  displayName: string;
  avatar_url?: string;
  created_at: string;
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
    .single();

  if (error) throw error;
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
