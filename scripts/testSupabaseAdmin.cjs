require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('Testing Supabase Admin API...');

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);


const createFakeUsers = async () => {
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  const testEmailIds = ['test1@example.com', 'test2@example.com', 'test3@example.com'];

  for (const email of testEmailIds) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: 'test123',
    });
    console.log('Admin API data:', JSON.stringify(data, null, 2));
  }
};

const listUsers = async () => {
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  const { data, error } = await supabase.auth.admin.listUsers();
  console.log('Admin API data:', JSON.stringify(data, null, 2));
};




(async () => {
  try {
    // await createFakeUsers();
    // await listUsers();

    // When user is create add entry in profiles table
    const { data, error } = await supabase.from('profiles').select('*').eq('id', 'test1@example.com').single();
    console.log('Admin API data:', JSON.stringify(data, null, 2));

    if (error) {
      console.error('Error fetching profiles:', error);
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
})();