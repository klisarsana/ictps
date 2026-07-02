import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://zhmtylyxojohnlsbguhe.supabase.co";
const supabaseKey = "sb_publishable_1A78QKZ3JPrFPNvse17uVQ_OS4OE4tl";

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from("coaching_records")
    .select("*")
    .limit(1);
    
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Coaching records data sample:", data);
  }

  // To get columns, we can just insert a bad row and catch the error, or query REST.
  // Actually, we can fetch all rows using admin role if we had one.
  // We can just rely on the data returned if it's not empty, but it was empty.
  
  // Let's try to insert a dummy record to see if it fails on RLS or column.
  const { error: insertErr3 } = await supabase
    .from("coaching_records")
    .insert({ 
      user_id: "00000000-0000-0000-0000-000000000000",
      nama_coachee: "Test",
      jabatan: "Test",
      unit_kerja: "Test",
      tanggal_sesi: "2026-06-02",
      coach_mentor: "Test",
      tujuan_utama: "Test",
      tujuan_kejelasan: "Test",
      tujuan_score: 5,
      kriteria_indikator: "Test",
      kriteria_kejelasan: "Test",
      kriteria_score: 5,
      motivasi_alasan: "Test",
      motivasi_kekuatan: "Test",
      motivasi_score: 5,
      ide_gagasan: "Test",
      ide_kreativitas: "Test",
      ide_score: 5,
      alternatif_pilihan: "Test",
      alternatif_realistis: "Test",
      alternatif_score: 5,
      action_plan_kejelasan: "Test",
      action_plan_score: 5,
      komitmen_peserta: "Test",
      komitmen_tindak_lanjut: "Test",
      komitmen_score: 5,
      action_plan: [{langkah: "Test", waktu: "Test", output: "Test"}]
    });
  console.log("Insert Error Fake user_id:", insertErr3);
}

test();
