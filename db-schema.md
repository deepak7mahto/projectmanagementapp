# Database Schema Reference (`public` schema)

This document provides a reference for the main application tables in the `public` schema of your Supabase/Postgres database.

---

## profiles
| Column      | Type                     | Nullable | Default                        |
|-------------|--------------------------|----------|--------------------------------|
| id          | uuid                     | NO       |                                |
| full_name   | text                     | YES      |                                |
| avatar_url  | text                     | YES      |                                |
| created_at  | timestamp with time zone | YES      | timezone('utc'::text, now())   |

## projects
| Column      | Type                     | Nullable | Default                        |
|-------------|--------------------------|----------|--------------------------------|
| id          | uuid                     | NO       | uuid_generate_v4()             |
| name        | text                     | NO       |                                |
| description | text                     | YES      |                                |
| owner_id    | uuid                     | YES      |                                |
| created_at  | timestamp with time zone | YES      | timezone('utc'::text, now())   |

## tasks
| Column      | Type                     | Nullable | Default                        |
|-------------|--------------------------|----------|--------------------------------|
| id          | uuid                     | NO       | uuid_generate_v4()             |
| title       | text                     | NO       |                                |
| description | text                     | YES      |                                |
| status      | text                     | YES      | 'TODO'::text                   |
| priority    | text                     | YES      | 'MEDIUM'::text                 |
| due_date    | date                     | YES      |                                |
| project_id  | uuid                     | YES      |                                |
| created_by  | uuid                     | YES      |                                |
| created_at  | timestamp with time zone | YES      | timezone('utc'::text, now())   |
| updated_at  | timestamp with time zone | YES      | timezone('utc'::text, now())   |

## task_assignees
| Column   | Type | Nullable | Default |
|----------|------|----------|---------|
| task_id  | uuid | NO       |         |
| user_id  | uuid | NO       |         |

## tags
| Column | Type | Nullable | Default         |
|--------|------|----------|-----------------|
| id     | uuid | NO       | uuid_generate_v4() |
| name   | text | NO       |                 |

## task_tags
| Column   | Type | Nullable | Default |
|----------|------|----------|---------|
| task_id  | uuid | NO       |         |
| tag_id   | uuid | NO       |         |

---
