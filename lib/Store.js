import { createClient } from "lib/supabase/index"
import { Client } from "@supabase/gotrue-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_ENDPOINT, process.env.NEXT_PUBLIC_SUPABASE_APIKEY);

export const auth = new Client({
  url: `${process.env.NEXT_PUBLIC_SUPABASE_ENDPOINT}/auth/v1`,
  headers: {
    'apiKey': process.env.NEXT_PUBLIC_SUPABASE_APIKEY
  },
  detectSessionInUrl: true,
  autoRefreshToken: true,
  persistSession: true,
});

const user = auth.currentUser;
if (user) supabase.setAccessToken(user.token.access_token)
