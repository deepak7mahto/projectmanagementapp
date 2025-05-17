import { supabase } from "./supabaseClient";

// TypeScript types matching your schema
type Project = {
  id: string;
  name: string;
  description?: string;
  owner_id?: string;
  created_at: string;
};

// CREATE a project
export async function createProject(project: Omit<Project, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("projects")
    .insert([{ ...project }])
    .select()
    .single();
  if (error) throw error;
  return data as Project;
}

// READ all projects (optionally by owner)
export async function getProjects(ownerId?: string) {
  let query = supabase.from("projects").select("*");
  if (ownerId) query = query.eq("owner_id", ownerId);
  const { data, error } = await query;
  if (error) throw error;
  return data as Project[];
}

// READ a single project by id
export async function getProjectById(id: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Project;
}

// UPDATE a project
export async function updateProject(id: string, updates: Partial<Omit<Project, "id" | "created_at">>) {
  const { data, error } = await supabase
    .from("projects")
    .update({ ...updates })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Project;
}

// DELETE a project
export async function deleteProject(id: string) {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
}
