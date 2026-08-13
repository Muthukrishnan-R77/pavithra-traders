"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminPasswordSchema } from "@/lib/validations";
import { Eye, EyeOff, Lock } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(adminPasswordSchema),
  });

  const onSubmit = async (data: { password: string }) => {
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Incorrect password. Please try again.");
      setLoading(false);
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111827] px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Pavithra Traders"
            width={180}
            height={72}
            className="mx-auto h-16 w-auto object-contain"
          />
          <p className="mt-3 text-sm font-semibold text-[#F59E0B]">Admin Panel</p>
          <p className="mt-1 text-sm text-gray-500">Enter password to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div>
            <label htmlFor="password" className="text-sm font-semibold text-[#111827]">
              Admin Password
            </label>
            <div className="relative mt-1">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter admin password"
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-12 text-sm focus:border-[#F59E0B] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-[#DC2626]">{errors.password.message as string}</p>
            )}
          </div>

          {error && <p className="rounded bg-red-50 p-3 text-sm text-[#DC2626]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#F59E0B] py-3 text-sm font-bold text-[#111827] hover:bg-[#d97706] disabled:opacity-50"
          >
            {loading ? "VERIFYING..." : "ENTER DASHBOARD"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
