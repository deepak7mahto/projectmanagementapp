import { supabase } from "./supabaseClient";

// TypeScript types matching your schema
type Profile = {
  id: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
};

// Get all user profiles
export async function getAllProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name')
    .order('full_name');

  if (error) throw error;
  return data as { id: string; full_name: string }[];
}

// Get all user emails using the Supabase admin API (requires service role key)
export async function getAllUserEmails() {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) throw error;
  return data.users.map((user: any) => ({
    id: user.id,
    email: user.email,
  }));
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
export async function updateProfile(id: string, updates: Partial<Omit<Profile, "id" | "created_at">>) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Profile;
}
