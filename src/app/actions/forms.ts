"use server";

export async function submitPemetaanDiri(data: unknown) {
  console.log("Submitting Pemetaan Diri:", data);
  
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // In a real app, you would insert into Supabase here
  // const supabase = await createClient();
  // const { error } = await supabase.from('pemetaan_diri').insert(data);
  // if (error) throw new Error(error.message);

  return { success: true, message: "Data pemetaan diri berhasil disimpan." };
}

export async function submitCoachingRecord(data: unknown) {
  console.log("Submitting Coaching Record:", data);
  
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return { success: true, message: "Coaching record berhasil disimpan." };
}
