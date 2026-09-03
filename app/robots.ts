import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/data";

/**
 * Mirrors _migration/03-server-files/robots.txt.
 *
 * The `/wp-admin/` and `wpo-plugins-tables-list.json` rules are carried over verbatim.
 * They describe paths that no longer exist in a Next.js app, but keeping them is harmless
 * and preserves the exact directives crawlers have already seen for this domain.
 *
 * One deliberate deviation: the source file also advertised `Sitemap: /sitemap.rss`.
 * Next generates `/sitemap.xml` only, and advertising a sitemap URL that 404s produces
 * fetch errors in Search Console — so that line is dropped rather than reproduced.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/wp-admin/admin-ajax.php",
      disallow: ["/wp-admin/", "/wp-content/uploads/wpo/wpo-plugins-tables-list.json"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
