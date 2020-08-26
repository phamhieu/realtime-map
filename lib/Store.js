import { createClient } from '@supabase/supabase-js'
import GoTrue from "lib/gotrue/index";

// Create a single supabase client for interacting with your database
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_ENDPOINT, process.env.NEXT_PUBLIC_SUPABASE_APIKEY);

export const auth = new GoTrue({
  APIUrl: `${process.env.NEXT_PUBLIC_SUPABASE_ENDPOINT}/auth/v1`,
  audience: '',
  setCookie: true,
});