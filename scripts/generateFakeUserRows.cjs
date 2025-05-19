// Node.js script to generate 100 fake SQL user rows for Supabase auth.users
const { faker } = require('@faker-js/faker');
const { randomUUID } = require('crypto');
const fs = require('fs');

const userRows = [];
const profileRows = [];

for (let i = 0; i < 100; i++) {
  const id = randomUUID();
  const email = faker.internet.email();
  const fullName = faker.person.fullName();
  userRows.push(`  ('${id}', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '${email}', '', now(), now(), '{}', '{}', false)`);
  profileRows.push(`  ('${id}', '${fullName.replace(/'/g, "''")}')`);
}

fs.writeFileSync('scripts/fakeUserRows.sql', userRows.join(',\n'));
fs.writeFileSync('scripts/fakeProfileRows.sql', profileRows.join(',\n'));
console.log('Generated scripts/fakeUserRows.sql and scripts/fakeProfileRows.sql');
