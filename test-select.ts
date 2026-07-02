import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://zhmtylyxojohnlsbguhe.supabase.co";
const supabaseKey = "sb_publishable_1A78QKZ3JPrFPNvse17uVQ_OS4OE4tl";
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from("coaching_records")
    .select("*");
  
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Coaching records fetch all:", data?.length);
  }
}

test();
