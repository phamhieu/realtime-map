import { createClient } from '@supabase/supabase-js'

const apiEndpoint = process.env.NEXT_PUBLIC_SUPABASE_ENDPOINT || "https://BeQiprVORewGZImzsKAS.supabase.co"
const apiKey = process.env.NEXT_PUBLIC_SUPABASE_APIKEY || "IHDL7hnmTSlqQ1fm7kYw5SBQPY11Rp"
// Create a single supabase client for interacting with your database 
export const supabase = createClient(apiEndpoint, apiKey);