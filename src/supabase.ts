import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://zmepwhybkwxelkkmhqtp.supabase.co";
const supabaseAnonKey = "sb_publishable_qookK6SClQ2VD3gKNTsIVA_oDIQtfvb";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)
