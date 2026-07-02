import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://zhmtylyxojohnlsbguhe.supabase.co";
const supabaseKey = "sb_publishable_1A78QKZ3JPrFPNvse17uVQ_OS4OE4tl";
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from("pemetaan_diri").select("*").limit(1);
  if (data && data.length > 0) {
    console.log("pemetaan_diri columns:", Object.keys(data[0]));
  } else {
    console.log("No data or error:", error);
  }
}

test();
