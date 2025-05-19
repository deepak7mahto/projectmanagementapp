import { supabase } from './supabaseClient';

// Default tags to be created in the database
const DEFAULT_TAGS = [
  { name: 'Bug' },
  { name: 'Feature' },
  { name: 'Enhancement' },
  { name: 'Documentation' },
  { name: 'Design' },
  { name: 'Testing' },
  { name: 'Research' },
  { name: 'Urgent' },
  { name: 'Backend' },
  { name: 'Frontend' },
  { name: 'Database' },
  { name: 'API' },
  { name: 'UI/UX' },
  { name: 'Security' },
  { name: 'Performance' }
];

/**
 * Sets up default tags in the database if they don't already exist
 * This function can be called during app initialization
 */
export async function setupDefaultTags() {
  try {
    console.log('Setting up default tags...');
    
    // Check if tags already exist
    const { data: existingTags, error: fetchError } = await supabase
      .from('tags')
      .select('name');
    
    if (fetchError) {
      console.error('Error fetching existing tags:', fetchError);
      return;
    }
    
    // Filter out tags that already exist
    const existingTagNames = existingTags?.map(tag => tag.name.toLowerCase()) || [];
    const tagsToCreate = DEFAULT_TAGS.filter(
      tag => !existingTagNames.includes(tag.name.toLowerCase())
    );
    
    if (tagsToCreate.length === 0) {
      console.log('All default tags already exist. No new tags created.');
      return;
    }
    
    // Insert new tags
    const { data, error } = await supabase
      .from('tags')
      .insert(tagsToCreate)
      .select();
    
    if (error) {
      console.error('Error creating default tags:', error);
      return;
    }
    
    console.log(`Successfully created ${data.length} default tags.`);
    return data;
  } catch (err) {
    console.error('Unexpected error setting up default tags:', err);
  }
}
