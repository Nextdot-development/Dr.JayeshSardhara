"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { SUPABASE_CONFIGURED, supabaseBrowser } from "@/lib/supabase/client";

/**
 * Session state for the dashboard, plus the redirect that keeps signed-out visitors
 * out of it.
 *
 * This guard is a convenience, not the security boundary. Row Level Security is — the
 * anon key in this bundle can only ever read posts the public could already see, so
 * defeating the redirect gains an attacker an empty table, not the content. That is
 * why an entirely client-side admin is safe to ship here.
 */

interface AuthState {
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  // Resolved in the initialiser rather than by an effect: with no credentials there is
  // nothing to wait for, and setting it from inside the effect would be a synchronous
  // state update during mount.
  const [loading, setLoading] = useState(SUPABASE_CONFIGURED);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/login/";

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;
    const supabase = supabaseBrowser();

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading || !SUPABASE_CONFIGURED) return;
    if (!session && !isLoginPage) router.replace("/admin/login/");
    if (session && isLoginPage) router.replace("/admin/");
  }, [session, loading, isLoginPage, router]);

  const signOut = async () => {
    if (SUPABASE_CONFIGURED) await supabaseBrowser().auth.signOut();
    router.replace("/admin/login/");
  };

  if (!SUPABASE_CONFIGURED) return <SetupNotice />;

  // The login page renders immediately, without waiting for the session lookup: it is
  // the same form either way, and holding it back showed "Loading…" to everyone signing
  // in — including in the server-rendered HTML. If a session does turn up, the effect
  // above redirects to the dashboard.
  if (loading && !isLoginPage) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Loading…
      </div>
    );
  }

  // Render nothing rather than a flash of the dashboard while the redirect runs.
  if (!session && !isLoginPage) return null;

  return (
    <AuthContext.Provider value={{ session, loading, signOut }}>{children}</AuthContext.Provider>
  );
}

/** Shown when the project has no Supabase credentials, instead of a broken login. */
function SetupNotice() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-4 px-6 py-20">
      <h1 className="font-display text-2xl font-medium text-navy-900">CMS not configured</h1>
      <p className="text-sm leading-relaxed text-muted">
        The dashboard needs <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> in <code>.env.local</code>. Copy{" "}
        <code>.env.example</code>, fill both in from your Supabase project&rsquo;s API settings, run{" "}
        <code>supabase/migrations/0001_blog_cms.sql</code> in the SQL editor, then restart the dev
        server.
      </p>
      <p className="text-sm text-muted">
        The public site is unaffected — it serves the migrated markdown posts with or without these.
      </p>
    </div>
  );
}
