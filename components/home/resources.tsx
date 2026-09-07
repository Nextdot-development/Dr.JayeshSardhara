import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PostsExplorer } from "@/components/blog/posts-explorer";
import { getPostSummaries } from "@/lib/content";

/**
 * Kept, not cut, in the 2026-09-04 density pass. The section chrome is template-authored,
 * but the three cards it renders are migrated WordPress articles — this is the only place
 * on the homepage that links straight into indexed post URLs, which "Blog" in the nav does
 * not replace. Compressed instead: the category-filter and search row that PostsExplorer
 * draws for /blog/ is suppressed here, since the teaser always shows a fixed three.
 */
export function Resources() {
  const posts = getPostSummaries();
  return (
    <section className="border-y border-border bg-surface/50 py-16 lg:py-20" id="resources">
      <Container>
        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <SectionHeading
            index="06"
            eyebrow="From the Journal"
            title="Insights for brain & spine health"
            description="Clear, medically-grounded articles to help you understand your condition and decide with confidence."
          />
          <Link
            href="/blog/"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-navy-800 dark:text-white/80"
          >
            View all articles
            <ArrowRight className="h-4 w-4 text-teal-600 transition-transform group-hover:translate-x-1 dark:text-teal-400" />
          </Link>
        </div>

        <div className="mt-8">
          <PostsExplorer posts={posts} limit={3} showFeatured={false} showControls={false} />
        </div>
      </Container>
    </section>
  );
}
