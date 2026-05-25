"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type AuthState = {
  error?: string;
  success?: string;
} | null;

export async function loginAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Map common Supabase auth errors to user-friendly Indonesian messages
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Email atau password salah. Silakan coba lagi." };
    }
    if (error.message.includes("Email not confirmed")) {
      return {
        error: "Email belum diverifikasi. Silakan cek inbox Anda.",
      };
    }
    return { error: error.message };
  }

  const role = data.user?.user_metadata?.role || "karyawan";

  // Redirect must be called outside of try/catch
  if (role === "admin") {
    redirect("/admin/dashboard");
  } else {
    redirect("/dashboard");
  }
}

export async function registerAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validation
  if (!name || !email || !password || !confirmPassword) {
    return { error: "Semua field wajib diisi." };
  }

  if (name.length < 2) {
    return { error: "Nama minimal 2 karakter." };
  }

  if (password.length < 8) {
    return { error: "Password minimal 8 karakter." };
  }

  if (password !== confirmPassword) {
    return { error: "Konfirmasi password tidak cocok." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role: "karyawan", // Default role for new registrations
      },
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "Email sudah terdaftar. Silakan login." };
    }
    return { error: error.message };
  }

  return {
    success:
      "Registrasi berhasil! Silakan cek email Anda untuk verifikasi akun.",
  };
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
