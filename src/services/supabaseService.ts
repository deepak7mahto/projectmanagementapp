import { supabase } from "../utils/supabaseClient";

export const supabaseService = {
  // Auth
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },
  // Profiles
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("displayName")
      .eq("id", userId)
      .single();
    if (error) throw error;
    return data;
  },
  // Add more methods for projects, tasks, etc as needed
};
