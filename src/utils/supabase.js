import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://nuwexikwwqycmeueztcn.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51d2V4aWt3d3F5Y21ldWV6dGNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE3NTYwNTcsImV4cCI6MjAwNzMzMjA1N30.AdAafHyr7d5yDCH0HqOmR_GjcHKTx30D_XR1VICKYXI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
