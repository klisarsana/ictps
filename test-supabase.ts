import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Fetching from admin_dashboard_summary...");
  const { data, error } = await supabase
    .from("admin_dashboard_summary")
    .select("*");
  
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Data length:", data?.length);
    console.log("Sample:", data?.slice(0, 2));
    const coaches = data?.filter(d => d.role === "coach") || [];
    console.log("Coaches:", coaches);
  }
}

test();
