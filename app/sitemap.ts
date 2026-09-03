import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/data";
import { getAllDocs } from "@/lib/content";

/**
 * Emits the indexable `action=keep` URLs from _migration/url-map.csv: all 197 keep rows
 * minus the 19 that carry `noindex` (18 tag archives + /thank-you/) = 178.
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
 * Deliberately excluded, per the 2026-09-03 decision: `/conditions/`, `/testimonials/`
 * and `/appointment/` (template-only routes with no live URL behind them), and the 8
 * parked rewrites in lib/blog-content.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return getAllDocs()
    .filter((doc) => !doc.noindex)
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((doc) => ({
      url: `${siteUrl}${doc.slug}`,
      lastModified: new Date((doc.modified ?? doc.date ?? "").replace(" ", "T") || Date.now()),
    }));
}
