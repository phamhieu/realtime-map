import { createClient } from "lib/supabase/index"
import { Client } from "@supabase/gotrue-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_ENDPOINT, process.env.NEXT_PUBLIC_SUPABASE_APIKEY);

export const auth = new Client({
  APIUrl: `${process.env.NEXT_PUBLIC_SUPABASE_ENDPOINT}/auth/v1`,
  APIKey: process.env.NEXT_PUBLIC_SUPABASE_APIKEY,
  audience: '',
  setCookie: true,
});

const user = auth.currentUser();
if (user) supabase.setAccessToken(user.token.access_token)
