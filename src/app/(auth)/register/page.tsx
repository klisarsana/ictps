"use client";

import { useActionState, useState } from "react";
import { registerAction, type AuthState } from "../../actions/auth";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Shield,
  User,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  BookOpen,
  TrendingUp,
} from "lucide-react";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    registerAction,
    null
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmValue, setConfirmValue] = useState("");

  const passwordsMatch =
    passwordValue.length > 0 &&
    confirmValue.length > 0 &&
    passwordValue === confirmValue;

  const passwordMismatch =
    confirmValue.length > 0 && passwordValue !== confirmValue;

  return (
    <div className="flex w-full min-h-screen">
      {/* ── Left Panel: Branding ──────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative auth-gradient-bg auth-pattern overflow-hidden">

        {/* Gradient orbs */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-accent-gold/8 blur-3xl animate-pulse-ring" />
        <div
          className="absolute -bottom-20 -left-20 w-52 h-52 rounded-full bg-accent-cyan/10 blur-3xl animate-pulse-ring"
          style={{ animationDelay: "1.5s" }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-20 py-12 text-white">
          <div className="animate-fade-in-left">

            <h1 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight mb-5">
              Bergabung dengan
              <br />
              <span className="bg-linear-to-r from-accent-gold to-accent-cyan bg-clip-text text-transparent">
                Ekosistem Talenta
              </span>
              <br />
              Digital
            </h1>

            <p className="text-lg text-white/65 leading-relaxed max-w-md mb-12">
              Daftarkan diri Anda dan mulai perjalanan pengembangan kompetensi
              melalui platform yang terintegrasi.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              {[
                {
                  icon: Sparkles,
                  title: "Profil Kompetensi",
                  desc: "Pemetaan kekuatan & area pengembangan",
                },
                {
                  icon: BookOpen,
                  title: "Rencana Coaching",
                  desc: "Program coaching yang dipersonalisasi",
                },
                {
                  icon: TrendingUp,
                  title: "Tracking Progres",
                  desc: "Pantau perkembangan secara real-time",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors duration-300">
                    <feature.icon className="w-5 h-5 text-accent-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white/90">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-white/50">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Register Form ────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-surface-light">
        <div className="w-full max-w-105 animate-fade-in-up">
          {/* Mobile branding */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-deep-blue flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-deep-blue">ICTPS</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              Buat Akun Baru
            </h2>
            <p className="text-text-secondary text-[0.9375rem]">
              Isi data berikut untuk mendaftar ke sistem ICTPS.
            </p>
          </div>

          {/* Success message */}
          {state?.success && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-success-green/8 border border-success-green/20 text-success-green text-sm font-medium flex items-start gap-2.5 animate-fade-in-up">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                {state.success}
                <Link
                  href="/"
                  className="block mt-1 underline underline-offset-2 hover:no-underline"
                >
                  Klik di sini untuk login →
                </Link>
              </div>
            </div>
          )}

          {/* Error message */}
          {state?.error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-error-red/8 border border-error-red/20 text-error-red text-sm font-medium flex items-start gap-2.5 animate-fade-in-up">
              <div className="w-5 h-5 rounded-full bg-error-red/15 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs">!</span>
              </div>
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-text-primary mb-1.5"
              >
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted pointer-events-none" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  required
                  autoComplete="name"
                  className="auth-input"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@kemenkeu.go.id"
                  required
                  autoComplete="email"
                  className="auth-input"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-primary mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 8 karakter"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="auth-input pr-12"
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
              {passwordValue.length > 0 && passwordValue.length < 8 && (
                <p className="mt-1 text-xs text-accent-gold">
                  Password minimal 8 karakter ({8 - passwordValue.length} lagi)
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-text-primary mb-1.5"
              >
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted pointer-events-none" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Ulangi password"
                  required
                  autoComplete="new-password"
                  className={`auth-input pr-12 ${passwordMismatch ? "error" : ""}`}
                  value={confirmValue}
                  onChange={(e) => setConfirmValue(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                  tabIndex={-1}
                  aria-label={showConfirm ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showConfirm ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
              {passwordMismatch && (
                <p className="mt-1 text-xs text-error-red">
                  Password tidak cocok
                </p>
              )}
              {passwordsMatch && (
                <p className="mt-1 text-xs text-success-green flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Password cocok
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="auth-btn mt-2"
              id="register-submit"
            >
              <span>
                {pending ? (
                  <>
                    <div className="spinner" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4.5 h-4.5" />
                    Daftar
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Login link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-text-secondary">
              Sudah punya akun?{" "}
              <Link
                href="/"
                className="font-semibold text-deep-blue hover:text-accent-blue transition-colors inline-flex items-center gap-1 group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Masuk
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-border-light">
            <p className="text-xs text-text-muted text-center">
              © {new Date().getFullYear()} Kementerian Keuangan Republik Indonesia.
              <br />
              Seluruh hak cipta dilindungi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
