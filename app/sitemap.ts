import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/data";
import { getAllDocs } from "@/lib/content";

/**
 * Emits the indexable `action=keep` URLs from _migration/url-map.csv: all 197 keep rows
 * minus the 19 that carry `noindex` (18 tag archives + /thank-you/) = 178 — plus the three
 * template-only routes listed below.
 *
 * noindex URLs are deliberately excluded — listing a page in the sitemap asks Google to
 * spend crawl budget on it while the page itself refuses indexing.
 *
 * `content/` is a 1:1 projection of those rows: the Phase 2 extraction wrote one file per
 * keep row and nothing else (197 files ↔ 197 keep rows), so iterating `content/` is
 * equivalent to reading the CSV, without coupling the app build to `_migration/`.
 *
 * `doc.slug` is the original WordPress path with its trailing slash, so the emitted URLs
 * match the old sitemap byte for byte.
 *
 * The 8 parked rewrites in lib/blog-content.ts remain excluded.
 */

/**
 * Template-only routes: no WordPress URL behind them, so no `content/` doc and nothing for
 * getAllDocs() to find. They must be listed explicitly.
 *
 * REVERSAL of the 2026-09-03 decision, which excluded all three as unreachable. As of
 * 2026-09-04 they are reachable and indexable: /conditions/ and /testimonials/ were added
 * to the main nav and are linked from the homepage, and /appointment/ was already the
 * target of the navbar's primary CTA — a linked page missing from the sitemap was simply
 * inconsistent. All three carry their own title and description.
 *
 * `lastModified` is the date they went live; there is no upstream document to date them by.
 */
const TEMPLATE_ONLY_ROUTES = ["/conditions/", "/testimonials/", "/appointment/"] as const;
const TEMPLATE_ONLY_PUBLISHED = new Date("2026-09-04");

export default function sitemap(): MetadataRoute.Sitemap {
  const migrated = getAllDocs()
    .filter((doc) => !doc.noindex)
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((doc) => ({
      url: `${siteUrl}${doc.slug}`,
      lastModified: new Date((doc.modified ?? doc.date ?? "").replace(" ", "T") || Date.now()),
    }));

  const templateOnly = TEMPLATE_ONLY_ROUTES.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: TEMPLATE_ONLY_PUBLISHED,
  }));

  return [...migrated, ...templateOnly];
}
