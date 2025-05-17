import { supabase } from "./supabaseClient";

// TypeScript types matching your schema
type Task = {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string | null;
  project_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

// CREATE a task
export async function createTask(task: Omit<Task, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase
    .from("tasks")
    .insert([{ ...task }])
    .select()
    .single();
  if (error) throw error;
  return data as Task;
}

// READ all tasks for a project
export async function getTasksByProject(projectId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId);
  if (error) throw error;
  return data as Task[];
}

// READ a single task by id
export async function getTaskById(id: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Task;
}

// UPDATE a task
export async function updateTask(id: string, updates: Partial<Omit<Task, "id" | "created_at" | "updated_at">>) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Task;
}

// DELETE a task
export async function deleteTask(id: string) {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
}
