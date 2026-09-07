"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Icon } from "@/components/ui/icon";
import { expertise } from "@/lib/data";

export function Expertise() {
  return (
    <section className="py-24 lg:py-32" id="expertise">
      <Container>
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <SectionHeading
            index="02"
            eyebrow="Areas of Expertise"
            title="Subspecialty care across the brain & spine"
          />
          <p className="text-muted md:pb-2">
            From complex tumor resection to keyhole disc surgery — the full spectrum, delivered with the latest
            technology and a minimally invasive philosophy.
          </p>
        </div>

        <div className="mt-16 grid gap-x-12 gap-y-px sm:grid-cols-2 lg:grid-cols-3">
          {expertise.map((e, i) => (
            <motion.div
              key={e.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={e.href}
                className="group flex h-full flex-col border-t border-navy-900/12 py-8 dark:border-white/12"
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-lg font-medium tabular-nums text-teal-700/60 dark:text-teal-300/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon
                    name={e.icon}
                    className="h-6 w-6 text-navy-400 transition-colors group-hover:text-teal-600 dark:text-white/40 dark:group-hover:text-teal-300"
                  />
                </div>
                <h3 className="mt-6 font-display text-xl font-medium text-navy-900 dark:text-white">{e.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{e.short}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-navy-800 dark:text-white/80">
                  Learn more
                  <ArrowRight className="h-4 w-4 text-teal-600 transition-transform duration-300 group-hover:translate-x-1 dark:text-teal-400" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
