import { supabase } from "./supabaseClient";

export interface Member {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
}

// Fetch project members with profile info
export async function getProjectMembers(projectId: string): Promise<Member[]> {
  // Step 1: Get all members for the project
  const { data: members, error } = await supabase
    .from("project_members")
    .select("user_id, role")
    .eq("project_id", projectId);

  if (error) throw error;
  if (!members || members.length === 0) return [];

  // Step 2: Get all profiles for those user_ids
  const userIds = members.map((m: any) => m.user_id);
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, displayName")
    .in("id", userIds);

  if (profilesError) throw profilesError;

  // Step 3: Merge
  return members.map((member: any) => {
    const profile = profiles?.find((p: any) => p.id === member.user_id);
    return {
      id: member.user_id,
      name: profile?.displayName || "Unknown",
      role: member.role || "member",
    };
  });
}

// Add a user to a project
export async function addProjectMember(
  projectId: string,
  userId: string,
  role: string = "member",
) {
  const { error } = await supabase
    .from("project_members")
    .insert([{ project_id: projectId, user_id: userId, role }]);
  if (error) throw error;
}

// Remove a user from a project
export async function removeProjectMember(projectId: string, userId: string) {
  const { error } = await supabase
    .from("project_members")
    .delete()
    .eq("project_id", projectId)
    .eq("user_id", userId);
  if (error) throw error;
}
