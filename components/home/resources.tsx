import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PostsExplorer } from "@/components/blog/posts-explorer";
import { getPostSummaries } from "@/lib/content";

export function Resources() {
  const posts = getPostSummaries();
  return (
    <section className="border-y border-border bg-surface/50 py-24 lg:py-32" id="resources">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            index="07"
            eyebrow="From the Journal"
            title="Insights for brain & spine health"
            description="Clear, medically-grounded articles to help you understand your condition and decide with confidence."
          />
          <a
            href="/blog/"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-navy-800 dark:text-white/80"
          >
            View all articles
            <ArrowRight className="h-4 w-4 text-teal-600 transition-transform group-hover:translate-x-1 dark:text-teal-400" />
          </a>
        </div>

        <div className="mt-14">
          <PostsExplorer posts={posts} limit={3} showFeatured={false} />
        </div>
      </Container>
    </section>
  );
}
