"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { unstable_noStore as noStore } from 'next/cache';

export async function getCoachList(): Promise<{ id: string; name: string }[]> {
  noStore();
  const supabase = await createClient();
  
  type UserRow = {
    id: string;
    name: string;
  };

  const { data, error } = await supabase
    .from("users")
    .select("id, name")
    .eq("role", "coach")
    .returns<UserRow[]>();

  console.log("SERVER DB CHECK - Coaches found:", data, "Error:", error);

  if (error || !data) {
    console.error("Error fetching coaches:", error);
    return [];
  }

  // Deduplicate by user_id in case the view returns multiple rows per user
  const uniqueCoaches = new Map<string, { id: string; name: string }>();
  data.forEach((coach) => {
    if (!uniqueCoaches.has(coach.id)) {
      uniqueCoaches.set(coach.id, { id: coach.id, name: coach.name || "Unknown Coach" });
    }
  });

  return Array.from(uniqueCoaches.values());
}

export async function requestBookingAction(
  coachId: string,
  date: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Unauthorized. Please log in." };
    }

    if (user.user_metadata?.role !== "karyawan") {
      return { error: "Access denied. Only Karyawan can request a booking." };
    }

    const { error: insertError } = await supabase
      .from("booking_coaching")
      .insert({
        karyawan_id: user.id,
        coach_id: coachId,
        tanggal_usulan: date,
        status: "Menunggu",
      });

    if (insertError) {
      console.error("Error inserting booking:", insertError);
      return { error: "Gagal membuat jadwal. Silakan coba lagi." };
    }

    revalidatePath("/karyawan/jadwal");
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in requestBookingAction:", err);
    return { error: "Terjadi kesalahan pada server." };
  }
}

export async function approveBookingAction(
  bookingId: string,
  teamsLink: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Unauthorized. Please log in." };
    }

    if (user.user_metadata?.role !== "coach") {
      return { error: "Access denied. Only Coach can approve bookings." };
    }

    const { error: updateError } = await supabase
      .from("booking_coaching")
      .update({
        status: "Disetujui",
        teams_link: teamsLink,
      })
      .eq("id", bookingId)
      .eq("coach_id", user.id); // Ensure the coach can only approve their own bookings

    if (updateError) {
      console.error("Error approving booking:", updateError);
      return { error: "Gagal menyetujui jadwal." };
    }

    revalidatePath("/coach/jadwal");
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in approveBookingAction:", err);
    return { error: "Terjadi kesalahan pada server." };
  }
}

export async function rescheduleBookingAction(
  bookingId: string,
  newDate: string,
  note: string,
  teamsLink: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Unauthorized. Please log in." };
    }

    if (user.user_metadata?.role !== "coach") {
      return { error: "Access denied. Only Coach can reschedule bookings." };
    }

    const { error: updateError } = await supabase
      .from("booking_coaching")
      .update({
        status: "Reschedule",
        tanggal_reschedule: newDate,
        catatan_reschedule: note,
        teams_link: teamsLink,
      })
      .eq("id", bookingId)
      .eq("coach_id", user.id);

    if (updateError) {
      console.error("Error rescheduling booking:", updateError);
      return { error: "Gagal melakukan reschedule." };
    }

    revalidatePath("/coach/jadwal");
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in rescheduleBookingAction:", err);
    return { error: "Terjadi kesalahan pada server." };
  }
}

export async function acceptRescheduleAction(
  bookingId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Unauthorized. Please log in." };
    }

    if (user.user_metadata?.role !== "karyawan") {
      return { error: "Access denied. Only Karyawan can accept reschedule." };
    }

    // First fetch the reschedule details
    const { data: booking, error: fetchError } = await supabase
      .from("booking_coaching")
      .select("tanggal_reschedule")
      .eq("id", bookingId)
      .eq("karyawan_id", user.id)
      .single();

    if (fetchError || !booking) {
      console.error("Error fetching booking details:", fetchError);
      return { error: "Data jadwal tidak ditemukan." };
    }

    if (!booking.tanggal_reschedule) {
      return { error: "Tidak ada tanggal reschedule untuk disetujui." };
    }

    const { error: updateError } = await supabase
      .from("booking_coaching")
      .update({
        status: "Disetujui",
        tanggal_usulan: booking.tanggal_reschedule,
        // Optional: clear reschedule notes or keep them for history
      })
      .eq("id", bookingId)
      .eq("karyawan_id", user.id);

    if (updateError) {
      console.error("Error accepting reschedule:", updateError);
      return { error: "Gagal menyetujui reschedule." };
    }

    revalidatePath("/karyawan/jadwal");
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in acceptRescheduleAction:", err);
    return { error: "Terjadi kesalahan pada server." };
  }
}

export async function declineAndRescheduleAction(
  bookingId: string,
  newDate: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Unauthorized. Please log in." };
    }

    if (user.user_metadata?.role !== "karyawan") {
      return { error: "Access denied. Only Karyawan can reschedule." };
    }

    const { error: updateError } = await supabase
      .from("booking_coaching")
      .update({
        status: "Menunggu",
        tanggal_usulan: newDate,
        tanggal_reschedule: null,
        catatan_reschedule: null,
      })
      .eq("id", bookingId)
      .eq("karyawan_id", user.id);

    if (updateError) {
      console.error("Error countering reschedule:", updateError);
      return { error: "Gagal mengajukan jadwal ulang." };
    }

    revalidatePath("/karyawan/jadwal");
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in declineAndRescheduleAction:", err);
    return { error: "Terjadi kesalahan pada server." };
  }
}
