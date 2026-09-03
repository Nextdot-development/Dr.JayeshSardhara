import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import type { ReactNode } from "react";

/** Editorial overline: a short rule + letterspaced label. No pills. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-teal-700 dark:text-teal-300",
        className,
      )}
    >
      <span aria-hidden className="h-px w-7 bg-teal-600/50 dark:bg-teal-400/50" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  index,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  index?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn("flex flex-col gap-5", align === "center" && "items-center text-center", className)}
    >
      {(eyebrow || index) && (
        <div className={cn("flex items-baseline gap-4", align === "center" && "justify-center")}>
          {index && (
            <span className="font-display text-sm font-medium tabular-nums text-teal-700/70 dark:text-teal-300/70">
              {index}
            </span>
          )}
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        </div>
      )}
      <h2 className="max-w-3xl font-display text-[2.05rem] font-medium leading-[1.08] tracking-[-0.01em] text-navy-900 sm:text-4xl lg:text-[2.9rem] dark:text-white">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed text-muted sm:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
