"use client";

import { useActionState, useState } from "react";
import { loginAction, type AuthState } from "../../actions/auth";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Shield,
  Target,
  Users,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    loginAction,
    null,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex w-full min-h-screen">
      {/* ── Left Panel: Branding ──────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative auth-gradient-bg auth-pattern overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-accent-cyan/10 blur-3xl animate-pulse-ring" />
        <div
          className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-accent-blue/10 blur-3xl animate-pulse-ring"
          style={{ animationDelay: "1.5s" }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-20 py-12 text-white">
          <div className="animate-fade-in-left">
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight mb-5">
              Integrated Coaching
              <br />
              <span className="bg-linear-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">
                & Talent Portfolio
              </span>
              <br />
              System
            </h1>

            <p className="text-lg text-white/65 leading-relaxed max-w-md mb-12">
              Platform digital untuk pengembangan kompetensi, pemetaan potensi,
              dan pengelolaan portofolio talenta terbaik.
            </p>

            {/* Feature highlights */}
            <div className="space-y-4">
              {[
                {
                  icon: Target,
                  title: "Pemetaan Diri",
                  desc: "Analisis kompetensi dan potensi",
                },
                {
                  icon: Users,
                  title: "Coaching Terintegrasi",
                  desc: "Sesi coaching terstruktur",
                },
                {
                  icon: Shield,
                  title: "Portofolio Digital",
                  desc: "Rekam jejak pengembangan",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors duration-300">
                    <feature.icon className="w-5 h-5 text-accent-cyan" />
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

      {/* ── Right Panel: Login Form ───────────────────────────────── */}
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
              Selamat Datang Kembali
            </h2>
            <p className="text-text-secondary text-[0.9375rem]">
              Masukkan kredensial Anda untuk mengakses sistem.
            </p>
          </div>

          {/* Error message */}
          {state?.error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-error-red/8 border border-error-red/20 text-error-red text-sm font-medium flex items-start gap-2.5 animate-fade-in-up">
              <div className="w-5 h-5 rounded-full bg-error-red/15 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs">!</span>
              </div>
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-5">
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
                  placeholder="Masukkan password"
                  required
                  autoComplete="current-password"
                  className="auth-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                  tabIndex={-1}
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="auth-btn mt-2"
              id="login-submit"
            >
              <span>
                {pending ? (
                  <>
                    <div className="spinner" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4.5 h-4.5" />
                    Masuk
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Register link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-text-secondary">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-semibold text-deep-blue hover:text-accent-blue transition-colors inline-flex items-center gap-1 group"
              >
                Daftar sekarang
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-border-light">
            <p className="text-xs text-text-muted text-center">
              © {new Date().getFullYear()} Kementerian Keuangan Republik
              Indonesia.
              <br />
              Seluruh hak cipta dilindungi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
