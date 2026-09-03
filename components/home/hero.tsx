"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { DoctorPhoto } from "@/components/ui/doctor-photo";
import { doctor, trustStats } from "@/lib/data";

const rise = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-0 sm:pt-40">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-teal-400/[0.07] blur-3xl" />
      </div>

      <Container>
        <div className="grid items-end gap-x-10 gap-y-14 lg:grid-cols-12">
          {/* copy */}
          <div className="lg:col-span-7">
            <motion.p
              variants={rise}
              custom={0}
              initial="hidden"
              animate="show"
              className="flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-teal-700 dark:text-teal-300"
            >
              <span className="h-px w-8 bg-teal-600/50" />
              {/* Live WordPress hero eyebrow, verbatim. */}
              feel the difference with us
            </motion.p>

            <motion.h1
              variants={rise}
              custom={1}
              initial="hidden"
              animate="show"
              className="mt-7 font-display text-[2.15rem] font-medium leading-[1.05] tracking-[-0.02em] text-navy-900 xs:text-[2.6rem] sm:text-6xl lg:text-[4.4rem] dark:text-white"
            >
              {/* Live WordPress H1 was the fragment "Your Health Is", with "Our Priority" in a
                  separate <p>. Same words, completed into one heading — see home-content.json
                  seo.headingAudit. */}
              Your Health Is{" "}
              <em className="not-italic text-gradient font-display italic">Our Priority</em>
            </motion.h1>

            <motion.p
              variants={rise}
              custom={2}
              initial="hidden"
              animate="show"
              className="mt-7 max-w-xl text-lg leading-relaxed text-muted"
            >
              {doctor.intro}
            </motion.p>

            <motion.div
              variants={rise}
              custom={3}
              initial="hidden"
              animate="show"
              className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4"
            >
              <Button href="#book_now" size="lg">
                Book An Appointment <ArrowRight className="h-4 w-4" />
              </Button>
              <a
                href="/testimonials/"
                className="group inline-flex items-center gap-2.5 text-sm font-semibold text-navy-800 dark:text-white"
              >
                <PlayCircle className="h-6 w-6 text-teal-600 transition-transform group-hover:scale-110 dark:text-teal-400" />
                Watch patient stories
              </a>
            </motion.div>

            <motion.div
              variants={rise}
              custom={4}
              initial="hidden"
              animate="show"
              className="mt-8 flex items-center gap-3 text-sm text-muted"
            >
              <span className="flex text-gold-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </span>
              <span>
                <strong className="font-semibold text-navy-900 dark:text-white">{doctor.rating.toFixed(1)}</strong> from{" "}
                {doctor.reviews} Google reviews
              </span>
            </motion.div>
          </div>

          {/* portrait */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="border border-navy-900/10 p-2 dark:border-white/10">
              <DoctorPhoto className="aspect-[4/5] w-full" priority sizes="(min-width: 1024px) 40vw, 90vw" />
            </div>
            <p className="mt-3 flex items-baseline justify-between gap-4 text-xs text-muted">
              <span className="font-semibold text-navy-800 dark:text-white/80">{doctor.name}</span>
              <span>{doctor.role}</span>
            </p>
          </motion.div>
        </div>
      </Container>

      {/* stats strip — editorial, hairline dividers */}
      <Container className="mt-16">
        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-2 border-y border-border sm:grid-cols-4"
        >
          {trustStats.map((s, i) => (
            <div
              key={s.label}
              className={`px-2 py-7 sm:px-6 ${i !== 0 ? "sm:border-l sm:border-border" : ""} ${i % 2 !== 0 ? "border-l border-border sm:border-l" : ""} ${i >= 2 ? "border-t border-border sm:border-t-0" : ""}`}
            >
              <dt className="font-display text-3xl font-medium tracking-tight text-navy-900 sm:text-4xl dark:text-white">
                {s.value}
              </dt>
              <dd className="mt-1.5 text-xs font-medium uppercase tracking-wider text-muted">{s.label}</dd>
            </div>
          ))}
        </motion.dl>
      </Container>
    </section>
  );
}
