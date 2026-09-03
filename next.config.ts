import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't pick up an unrelated parent lockfile.
  turbopack: {
    root: path.resolve(),
  },

  // WordPress served every URL with a trailing slash and the sitemap/canonicals still
  // reflect that. Matching it avoids a redirect hop on every indexed URL.
  trailingSlash: true,

  async redirects() {
    return [
      // The only two URL changes in the migration — see _migration/url-map.csv.
      { source: "/contact-us", destination: "/contact/", permanent: true },
      { source: "/category/uncategorized", destination: "/blog/", permanent: true },
    ];
  },

  /**
   * Migrated WordPress media lives in Cloudflare R2, not in the repo — see
   * _migration/R2-SETUP.md and _migration/IMAGE-HOSTING-OPTIONS.md.
   *
   * The rewrite keeps the ORIGINAL `/wp-content/uploads/...` paths working, so every
   * inbound link, every `content/*.md` reference and anything Google Images has indexed
   * continues to resolve. It is invisible to visitors and crawlers.
   *
   * With R2_PUBLIC_BASE unset (local dev), no rewrite is registered and the files are
   * served straight from `public/`, which is where they already are.
   */
  async rewrites() {
    const base = process.env.R2_PUBLIC_BASE?.replace(/\/$/, "");
    if (!base) return [];
    return [
      {
        source: "/wp-content/uploads/:path*",
        destination: `${base}/wp-content/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;

/**
 * On _migration/03-server-files/htaccess — deliberately NOT ported.
 *
 * That file contains three kinds of RewriteRule, none of which belongs here:
 *
 * 1. A cloaking rule that rewrites `^$` to `amp.php` for Googlebot user agents or any
 *    visitor arriving with a `google.` referer. This is the SEO-parasite hack documented
 *    in _migration/INVENTORY.md §8 — it served different content to Google than to real
 *    users. It is malware, not configuration, and must never be reproduced.
 * 2. Hardening rules blocking `wp-admin/includes/`, `wp-includes/*.php` and
 *    `theme-compat/`. These protect PHP files that do not exist in a Next.js app.
 * 3. The standard WordPress front-controller rule routing everything to `index.php`.
 *    Superseded by Next's own routing.
 *
 * So the redirect table above is exactly the two `action=redirect` rows from url-map.csv
 * and nothing else. There are no legitimate legacy rewrites to preserve.
 */
