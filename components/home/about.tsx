import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { DoctorPhoto } from "@/components/ui/doctor-photo";
import { Reveal } from "@/components/ui/reveal";
import { doctor, SURGERIES_TOTAL } from "@/lib/data";

const highlights = [
  { value: `${doctor.publications}`, label: "Research Publications" },
  { value: "Gold Medal", label: "Best MCh Resident" },
  { value: `${doctor.books}`, label: "Books Authored" },
  { value: `${doctor.patents}`, label: "Patent Held" },
];

export function About() {
  return (
    <section className="py-24 lg:py-32" id="about">
      <Container className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        {/* portrait */}
        <Reveal className="order-2 lg:order-1 lg:col-span-5">
          <div className="border border-navy-900/10 p-2 dark:border-white/10">
            <DoctorPhoto className="aspect-[4/5] w-full" sizes="(min-width: 1024px) 40vw, 90vw" />
          </div>
          <p className="mt-3 flex items-baseline justify-between gap-4 text-xs text-muted">
            <span className="font-semibold text-navy-800 dark:text-white/80">{doctor.name}</span>
            <span>{doctor.credentials}</span>
          </p>
        </Reveal>

        {/* copy */}
        <div className="order-1 lg:order-2 lg:col-span-7">
          <Eyebrow>About the Surgeon</Eyebrow>
          <h2 className="mt-6 font-display text-[2.05rem] font-medium leading-[1.1] tracking-tight text-navy-900 sm:text-4xl lg:text-[2.8rem] dark:text-white">
            Precision from the operating room, warmth at the bedside.
          </h2>
          {/* Copy migrated from the live WordPress homepage — see _migration/PAGE-REBUILD.md §1. */}
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
            <p>
              With over {doctor.experienceYears} years of experience, {doctor.name} is not just a neurosurgeon — he&rsquo;s a
              dedicated healer, innovator, and mentor. As the Director of Minimally Invasive Brain and Spine Surgery at
              Fortis Group of Hospitals (Mulund, Kalyan &amp; S.L. Raheja), he has helped thousands of patients regain
              their health and mobility.
            </p>
            <p>
              His expertise lies in endoscopic brain and spine surgery, offering safer, faster recovery options. Having
              performed {SURGERIES_TOTAL} brain and spine procedures, his impact speaks for itself. A recipient of the
              Best Young Neurosurgeon of India (2016, Mumbai) award, {doctor.shortName} is also a pediatric neurosurgeon,
              ensuring even the youngest patients receive world-class care.
            </p>
            <p>
              Beyond the operating room, he is a passionate researcher and innovator, holding one patent,{" "}
              {doctor.publications} research publications, and two authored books. As the Chairman of the Young
              Neurosurgical Forum and the Innovation &amp; Patent Cell at NSI, India, he is shaping the future of
              neurosurgery.
            </p>
            <p>
              For {doctor.shortName}, every patient is more than just a case — it&rsquo;s a life to be restored, a future
              to be rebuilt.
            </p>
          </div>

          <dl className="mt-10 grid grid-cols-2 border-t border-navy-900/12 dark:border-white/12 sm:grid-cols-4">
            {highlights.map((h, i) => (
              <div key={h.label} className={`py-6 ${i !== 0 ? "sm:border-l sm:border-navy-900/12 sm:pl-6 dark:sm:border-white/12" : ""} ${i % 2 !== 0 ? "border-l border-navy-900/12 pl-6 dark:border-white/12 sm:pl-6" : ""}`}>
                <dt className="font-display text-2xl font-medium text-navy-900 dark:text-white">{h.value}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-muted">{h.label}</dd>
              </div>
            ))}
          </dl>

          {/* Fortis Institute positioning — migrated from the live homepage (PAGE-REBUILD.md §1, harvest 3). */}
          <div className="mt-10 space-y-4 border-t border-navy-900/12 pt-8 text-base leading-relaxed text-muted dark:border-white/12">
            <p>
              At Fortis Mumbai, {doctor.name} stands at the forefront of brain and spine innovation — a neurosurgeon
              redefining what&rsquo;s possible. With unmatched precision and a relentless patient-first approach, he
              transforms complex, high-risk surgeries into minimally invasive, life-changing procedures — often enabling
              patients to walk out the very same day.
            </p>
            <p>
              A pioneer in advanced neuro-endoscopy, {doctor.shortName} leads with skill, vision, and empathy. At the
              Fortis Institute of Minimally Invasive Brain &amp; Spine Surgery, his expertise turns &ldquo;keyhole&rdquo;
              techniques into powerful outcomes — delivering safer surgeries, faster recovery, and a new global benchmark
              in neurosurgical excellence.
            </p>
          </div>

          <div className="mt-10">
            <Button href="/about/" variant="secondary">
              Full profile &amp; credentials
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
