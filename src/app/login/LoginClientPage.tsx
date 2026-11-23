"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction, registerAction } from "../actions/auth";

export function LoginClientPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [registerTitle, setRegisterTitle] = useState("Mr.");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerAgreeTerms, setRegisterAgreeTerms] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const [showForgotNotice, setShowForgotNotice] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await loginAction({
        email: loginEmail,
        password: loginPassword,
      });

      if (!res.success) {
        setLoginError(res.error || "Invalid email address or password.");
      } else {
        router.push("/account");
        router.refresh();
      }
    } catch {
      setLoginError("An unexpected security error occurred. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    if (!registerAgreeTerms) {
      setRegisterError("You must accept the Terms and Conditions and Privacy Policy to create an account.");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError("The passwords entered do not match.");
      return;
    }

    setRegisterLoading(true);

    try {
      const res = await registerAction({
        title: registerTitle,
        firstName: registerFirstName,
        lastName: registerLastName,
        email: registerEmail,
        password: registerPassword,
        confirmPassword: registerConfirmPassword,
        agreeTerms: registerAgreeTerms,
      });

      if (!res.success) {
        setRegisterError(res.error || "Unable to complete registration. Please check your details.");
      } else {
        router.push("/account");
        router.refresh();
      }
    } catch {
      setRegisterError("An unexpected security error occurred. Please try again.");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-28 sm:pt-32 pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-8 font-sans">
          <Link href="/" className="hover:text-[#a7c080] transition-colors">
            Home
          </Link>
          <span className="mx-2 text-neutral-700">/</span>
          <span className="text-[#a7c080] font-semibold">Sign In or Register</span>
        </nav>

        <div className="border-b border-[#1c1c1c] pb-6 mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal uppercase tracking-wider">
            Sign In or Register
          </h1>
          <p className="font-serif text-xs text-neutral-400 mt-2">
            Access your curated creations, order tracking, and private atelier styling itineraries.
          </p>
        </div>

        <div className="flex border-b border-[#1c1c1c] mb-10 lg:hidden">
          <button
            type="button"
            onClick={() => setActiveTab("signin")}
            className={`flex-1 py-3 text-xs uppercase tracking-[0.2em] font-semibold text-center transition-colors border-b-2 -mb-[1px] ${
              activeTab === "signin"
                ? "border-[#a7c080] text-white"
                : "border-transparent text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Registered Clients
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-3 text-xs uppercase tracking-[0.2em] font-semibold text-center transition-colors border-b-2 -mb-[1px] ${
              activeTab === "register"
                ? "border-[#a7c080] text-white"
                : "border-transparent text-neutral-500 hover:text-neutral-300"
            }`}
          >
            New Clients
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div
            className={`space-y-6 ${
              activeTab === "signin" ? "block" : "hidden lg:block"
            }`}
          >
            <div className="space-y-2 border-b border-[#1c1c1c] pb-4">
              <h2 className="font-serif text-xl sm:text-2xl text-white uppercase tracking-wider font-normal">
                Registered Clients
              </h2>
              <p className="font-serif text-xs text-neutral-400 leading-relaxed font-light">
                If you already hold a client account with VOYOR, please sign in with your email address.
              </p>
            </div>

            {loginError && (
              <div className="p-4 bg-[#141414] border border-rose-900/60 text-rose-300 text-xs font-serif leading-relaxed">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-5 text-xs font-serif" noValidate>
              <div>
                <label className="block text-neutral-400 mb-1.5 uppercase tracking-wider text-[11px]">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-[#111111] border border-[#262626] focus:border-[#a7c080] px-3.5 py-3 text-white placeholder-neutral-600 outline-none text-sm transition-colors"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-neutral-400 uppercase tracking-wider text-[11px]">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotNotice(!showForgotNotice)}
                    className="text-[11px] text-neutral-400 hover:text-[#a7c080] underline transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#111111] border border-[#262626] focus:border-[#a7c080] px-3.5 py-3 text-white placeholder-neutral-600 outline-none text-sm transition-colors"
                />
              </div>

              {showForgotNotice && (
                <div className="p-3.5 bg-[#121212] border border-[#262626] text-neutral-300 text-[11px] leading-relaxed">
                  For client security, password reset requests are handled directly by our private Concierge desk. Please email <span className="text-[#a7c080]">concierge@voyor.com</span> or call +39 02 7600 1234 to verify identity and receive an encrypted recovery code.
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-4 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold uppercase tracking-[0.2em] transition-colors disabled:opacity-50 shadow-lg shadow-[#a7c080]/10 cursor-pointer"
                >
                  {loginLoading ? "AUTHENTICATING..." : "SIGN IN"}
                </button>
              </div>

              <div className="pt-4 border-t border-[#181818] text-[11px] text-neutral-500 leading-relaxed">
                By signing in, you confirm your access complies with VOYOR&apos;s authenticated client security protocol. All sessions are encrypted with TLS 1.3.
              </div>
            </form>
          </div>

          <div
            className={`space-y-6 ${
              activeTab === "register" ? "block" : "hidden lg:block lg:pl-8 lg:border-l lg:border-[#1c1c1c]"
            }`}
          >
            <div className="space-y-2 border-b border-[#1c1c1c] pb-4">
              <h2 className="font-serif text-xl sm:text-2xl text-white uppercase tracking-wider font-normal">
                New Clients
              </h2>
              <p className="font-serif text-xs text-neutral-400 leading-relaxed font-light">
                Creating an account allows you to track bespoke creations, schedule in-boutique appointments, save styling sizes, and receive seasonal runway invitations.
              </p>
            </div>

            {registerError && (
              <div className="p-4 bg-[#141414] border border-rose-900/60 text-rose-300 text-xs font-serif leading-relaxed">
                {registerError}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs font-serif" noValidate>
              <div>
                <label className="block text-neutral-400 mb-1.5 uppercase tracking-wider text-[11px]">
                  Title *
                </label>
                <select
                  value={registerTitle}
                  onChange={(e) => setRegisterTitle(e.target.value)}
                  className="w-full bg-[#111111] border border-[#262626] focus:border-[#a7c080] px-3.5 py-3 text-white outline-none text-sm transition-colors cursor-pointer"
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1.5 uppercase tracking-wider text-[11px]">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="given-name"
                    value={registerFirstName}
                    onChange={(e) => setRegisterFirstName(e.target.value)}
                    placeholder="First Name"
                    className="w-full bg-[#111111] border border-[#262626] focus:border-[#a7c080] px-3.5 py-3 text-white placeholder-neutral-600 outline-none text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1.5 uppercase tracking-wider text-[11px]">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="family-name"
                    value={registerLastName}
                    onChange={(e) => setRegisterLastName(e.target.value)}
                    placeholder="Last Name"
                    className="w-full bg-[#111111] border border-[#262626] focus:border-[#a7c080] px-3.5 py-3 text-white placeholder-neutral-600 outline-none text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1.5 uppercase tracking-wider text-[11px]">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-[#111111] border border-[#262626] focus:border-[#a7c080] px-3.5 py-3 text-white placeholder-neutral-600 outline-none text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1.5 uppercase tracking-wider text-[11px]">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="At least 8 characters (1 uppercase, 1 lowercase, 1 number)"
                  className="w-full bg-[#111111] border border-[#262626] focus:border-[#a7c080] px-3.5 py-3 text-white placeholder-neutral-600 outline-none text-sm transition-colors"
                />
                <p className="text-[10px] text-neutral-500 mt-1">
                  Must contain minimum 8 characters, at least one uppercase letter, one lowercase letter, and one number.
                </p>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1.5 uppercase tracking-wider text-[11px]">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full bg-[#111111] border border-[#262626] focus:border-[#a7c080] px-3.5 py-3 text-white placeholder-neutral-600 outline-none text-sm transition-colors"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={registerAgreeTerms}
                    onChange={(e) => setRegisterAgreeTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 bg-[#111111] border border-[#333] accent-[#a7c080] cursor-pointer"
                  />
                  <span className="text-[11px] text-neutral-400 leading-relaxed font-light">
                    I confirm that I have read and accepted the{" "}
                    <Link href="/terms-and-conditions" className="text-white underline hover:text-[#a7c080]">
                      Terms and Conditions
                    </Link>{" "}
                    and the{" "}
                    <Link href="/privacy-policy" className="text-white underline hover:text-[#a7c080]">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={registerLoading}
                  className="w-full py-4 bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-[0.2em] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {registerLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
