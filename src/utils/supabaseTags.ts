import { supabase } from "./supabaseClient";

// TypeScript types matching your schema
type Tag = {
  id: string;
  name: string;
};

type TaskTag = {
  task_id: string;
  tag_id: string;
};

// CREATE a tag
export async function createTag(name: string) {
  const { data, error } = await supabase
    .from("tags")
    .insert([{ name }])
    .select()
    .single();
  if (error) throw error;
  return data as Tag;
}

// READ all tags
export async function getAllTags() {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .order("name");
  if (error) throw error;
  return data as Tag[];
}

// Assign tags to a task
export async function assignTagsToTask(taskId: string, tagIds: string[]) {
  // First remove all existing tags for this task
  await removeAllTagsFromTask(taskId);
  
  // Then add the new tags
  if (tagIds.length === 0) return [];
  
  const taskTags = tagIds.map(tagId => ({
    task_id: taskId,
    tag_id: tagId
  }));
  
  const { data, error } = await supabase
    .from("task_tags")
    .insert(taskTags)
    .select();
  
  if (error) throw error;
  return data as TaskTag[];
}

// Get tags for a task
export async function getTagsForTask(taskId: string) {
  const { data, error } = await supabase
    .from("task_tags")
    .select("tag_id, tags(id, name)")
    .eq("task_id", taskId);
  
  if (error) throw error;
  
  // Extract the tag objects from the joined query
  // Handle the nested structure that Supabase returns
  return data.map(item => item.tags as unknown as Tag);
}

// Remove all tags from a task
export async function removeAllTagsFromTask(taskId: string) {
  const { error } = await supabase
    .from("task_tags")
    .delete()
    .eq("task_id", taskId);
  
  if (error) throw error;
  return true;
}
