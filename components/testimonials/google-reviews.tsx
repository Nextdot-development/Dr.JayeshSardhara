import { Star } from "lucide-react";
import { doctor, googleReviews, type GoogleReview } from "@/lib/data";

function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function Stars({ n, className = "" }: { n: number; className?: string }) {
  return (
    <span className={`flex gap-0.5 text-gold-500 ${className}`} aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < n ? "fill-current" : "fill-none opacity-30"}`} />
      ))}
    </span>
  );
}

const avatarColors = ["#a63a35", "#8a2f2c", "#cfa451", "#6a2422", "#b5463f", "#9c332e"];

function ReviewCard({ r, i }: { r: GoogleReview; i: number }) {
  return (
    <figure className="mb-5 break-inside-avoid rounded-xl border border-border bg-background p-5 shadow-[0_1px_2px_rgb(42_26_24/0.04)]">
      <div className="flex items-center gap-3">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: avatarColors[i % avatarColors.length] }}
        >
          {r.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <figcaption className="truncate text-sm font-semibold text-navy-900 dark:text-white">{r.name}</figcaption>
          <p className="text-xs text-muted">{r.date}</p>
        </div>
        <GoogleG className="h-5 w-5 shrink-0" />
      </div>
      <Stars n={r.rating} className="mt-3" />
      <blockquote className="mt-2.5 text-sm leading-relaxed text-navy-800/90 dark:text-white/80">{r.text}</blockquote>
    </figure>
  );
}

export function GoogleReviews() {
  const mapsUrl = "https://www.google.com/maps/search/Dr+Jayesh+Sardhara+neurosurgeon+reviews";

  return (
    <div>
      {/* summary header */}
      <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface/60 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-center gap-5">
          <GoogleG className="h-11 w-11" />
          <div>
            <p className="text-lg font-semibold text-navy-900 dark:text-white">Google Reviews</p>
            <div className="mt-1 flex items-center gap-3">
              <span className="font-display text-3xl font-medium text-navy-900 dark:text-white">
                {doctor.rating.toFixed(1)}
              </span>
              <span>
                <Stars n={5} />
                <span className="mt-0.5 block text-xs text-muted">Based on {doctor.reviews} reviews</span>
              </span>
            </div>
          </div>
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-navy-200 px-5 py-2.5 text-sm font-semibold text-navy-800 transition-colors hover:border-teal-500 hover:text-teal-700 dark:border-white/15 dark:text-white/85 sm:self-center"
        >
          <GoogleG className="h-4 w-4" /> Review us on Google
        </a>
      </div>

      {/* review wall */}
      <div className="mt-8 gap-5 [column-fill:_balance] sm:columns-2 lg:columns-3">
        {googleReviews.map((r, i) => (
          <ReviewCard key={r.name + i} r={r} i={i} />
        ))}
      </div>
    </div>
  );
}
