import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lofycmbjcsqrryuusgoy.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvZnljbWJqY3NxcnJ5dXVzZ295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNDgxMTUsImV4cCI6MjA5MTcyNDExNX0.16CwBDSLpwYpyyIiTuQ_0WRooo-2pPjsZ7w_hy7xXYk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
