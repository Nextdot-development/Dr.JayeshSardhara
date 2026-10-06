"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { AdminButton, Banner, Field, Input } from "@/components/admin/ui";

/**
 * Email + password sign-in.
 *
 * Deliberately no sign-up link and no password reset: accounts are created by hand in
 * the Supabase dashboard. This is a two-author site, and a self-service path into the
 * CMS would be the weakest thing about it.
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password });
    setBusy(false);

    if (error) {
      // Supabase already returns a deliberately vague message for bad credentials;
      // it is passed through rather than made more specific.
      setError(error.message);
      return;
    }
    router.replace("/admin/");
  };

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-sm flex-col justify-center">
      <h1 className="font-display text-2xl font-medium text-navy-900">Sign in</h1>
      <p className="mt-1 text-sm text-muted">Dr. Jayesh Sardhara — content management</p>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
        {error && <Banner tone="error">{error}</Banner>}

        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field label="Password" htmlFor="password">
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // Room for the toggle, so a long password never runs under it.
              className="pr-10"
            />
            <button
              type="button"
              // `tabIndex={-1}` keeps Tab going straight from the password field to
              // Sign in. Someone typing a password and pressing Tab expects to submit,
              // not to land on a reveal button.
              tabIndex={-1}
              onClick={() => setShowPassword((shown) => !shown)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              aria-controls="password"
              title={showPassword ? "Hide password" : "Show password"}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted transition-colors hover:bg-surface hover:text-navy-900"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </Field>

        <AdminButton type="submit" variant="primary" disabled={busy} className="mt-2">
          {busy ? "Signing in…" : "Sign in"}
        </AdminButton>
      </form>
    </div>
  );
}
