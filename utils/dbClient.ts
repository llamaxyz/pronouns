import { createClient } from '@supabase/supabase-js'

const dbClient = createClient(process.env.DB_URL ?? '', process.env.DB_KEY ?? '')

export default dbClient
