# Live Tracker Map [WIP]

Build with supabase auth, realtime and leafletjs. [[Demo App]](https://realtime-map-v2.vercel.app/)

<p align="center">
<kbd>
<img src="https://media.giphy.com/media/iDU80ngpsSddc0ObGI/giphy.gif" alt="Demo"/>
</kbd>
</p>

## How to use

#### Clone this folder

```bash
git clone https://github.com/phamhieu/supabase-realtime-map-v2.git
cd supabase-realtime-map-v2
```

#### Install dependencies

```bash
npm install
```

#### Start the app

```bash
# Open a terminal and run:
npm run dev
```

Visit http://localhost:3000 and start testing!

## Test with your own Supabase Project

NOTE: you have to enable `DISABLE EMAIL CONFIRMATIONS` under your Supabase project settings.

#### Database schema

Go to [app.supabase.io](https://app.supabase.io/), create a new organisation and project if you haven't had one.  
Run this sql query to create required tables.

```sql
-- Expose public user data
create view public.profiles as
select
  id,
  raw_user_meta_data -> 'avatar_url' as avatar_url,
  raw_user_meta_data -> 'role' as role,
  raw_user_meta_data -> 'username' as username
from auth.users
offset null; -- https://github.com/PostgREST/postgrest/issues/1647

-- Locations
CREATE TABLE public.locations (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL
);
ALTER TABLE public.locations REPLICA IDENTITY FULL; -- Send "previous data" on change
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
COMMENT ON table public.locations IS 'Individual locations sent by each user.';
CREATE POLICY "Allow logged-in read access" on public.locations USING ( auth.role() = 'authenticated' );
CREATE POLICY "Allow individual insert access" on public.locations FOR INSERT WITH CHECK ( auth.uid() = user_id );
```

#### Setup env vars

Next, copy the `.env.local.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.local.example .env.local
```

Then set each variable on `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` should be the **API URL**
- `NEXT_PUBLIC_SUPABASE_KEY` should be the **anon** key

You can get these values from your project dashboard at [app.supabase.io](https://app.supabase.io/).

The **anon** key is your client-side API key. It allows "anonymous access" to your database, until the user has logged in. Once they have logged in, the keys will switch to the user's own login token. This enables row level security for your data.

> **_NOTE_**: The `service_role` key has full access to your data, bypassing any security policies. These keys have to be kept secret and are meant to be used in server environments and never on a client or browser.
