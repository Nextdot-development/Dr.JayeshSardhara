/**
 * Supabase configuration, read once.
 *
 * Only the project URL and the PUBLISHABLE (anon) key are ever used — by the server
 * reader and by the admin browser client alike. There is no service-role key in this
 * codebase: the public read policy already returns exactly the visible posts, and
 * admin writes carry the logged-in user's own JWT. Nothing needs to bypass RLS, so
 * nothing holds a key that could.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/**
 * Whether the CMS is wired up at all.
 *
 * `CMS_ENABLED=false` is the instant rollback: every reader short-circuits, no
 * Supabase call is made, and the site serves only the 180 migrated markdown posts
 * exactly as it did before this feature existed. Missing credentials have the same
 * effect, so a fresh clone with no `.env.local` still builds and runs.
 *
 * **Server-side only.** `CMS_ENABLED` has no `NEXT_PUBLIC_` prefix, so it is not inlined
 * into the browser bundle: in a client component `process.env.CMS_ENABLED` is
 * `undefined`, which makes this constant evaluate to `true` regardless of the real
 * setting. Read it from Route Handlers and server modules only — never to gate client
 * UI. (This module is imported by lib/supabase/client.ts for the URL and key, which is
 * why the warning is here rather than somewhere the value is used.)
 */
export const CMS_ENABLED =
  process.env.CMS_ENABLED !== "false" && Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

/** Absolute site origin for canonicals and OG urls. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://drjayeshsardhara.com").replace(
  /\/$/,
  "",
);
