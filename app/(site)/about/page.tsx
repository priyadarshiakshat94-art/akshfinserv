import type { Metadata } from "next";
import Image from "next/image";
import { getAllTeam } from "@/lib/content";
import { Markdown } from "@/lib/mdx";
import { publicFileExists } from "@/lib/assets";
import { PageIntro } from "@/components/site/page-intro";
import { Section, SectionHeading } from "@/components/site/section";
import { FadeIn } from "@/components/motion/fade-in";
import { CtaBand } from "@/components/site/cta-band";

export const metadata: Metadata = {
  title: "About",
  description:
    "Aksh Finserv has advised Mumbai families from one office in Powai since 1998. Meet Plabita, Sanjiv and Shailee.",
  alternates: { canonical: "/about" },
};

const FACTS = [
  { value: "1998", label: "First client, Powai" },
  { value: "1,500", label: "Families today" },
  { value: "₹250 Cr", label: "Under advice" },
  { value: "100+", label: "Industry awards" },
];

export default function AboutPage() {
  const team = getAllTeam();

  return (
    <>
      <PageIntro
        eyebrow="About"
        title="One office in Powai. 28 years. The same people answering the phone."
        lede="Aksh Finserv started in 1998 with a handful of neighbours who wanted their insurance papers explained. Most of our clients still come the same way: someone they know sent them."
      />

      <Section className="pt-0 lg:pt-0">
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {FACTS.map((f, i) => (
            <FadeIn
              key={f.label}
              delay={i * 0.04}
              className={i === 2 ? "rounded-card bg-gold p-7 text-ink-dark" : "rounded-card border border-line bg-elevated p-7"}
            >
              <dt className={i === 2 ? "text-sm text-[#3d2f1a]" : "text-sm text-ink-secondary"}>{f.label}</dt>
              <dd className="display-num mt-10 text-[clamp(2.5rem,5vw,4rem)]">{f.value}</dd>
            </FadeIn>
          ))}
        </dl>
      </Section>

      <Section className="pt-0 lg:pt-0">
        <SectionHeading eyebrow="The people" title="Three advisors. Every client knows at least one by first name." />
        <div className="space-y-4">
          {team.map((m) => (
            <FadeIn key={m.slug}>
              <article
                id={m.slug}
                className="grid scroll-mt-24 gap-8 rounded-card border border-line bg-elevated p-6 md:grid-cols-[18rem_minmax(0,1fr)] md:p-8 lg:gap-14 lg:p-10"
              >
                <div className="relative aspect-[4/4.4] overflow-hidden rounded-[20px] bg-elevated-2">
                  {publicFileExists(m.photo) ? (
                    <Image src={m.photo} alt={m.photoAlt} fill sizes="18rem" className="object-cover" />
                  ) : (
                    <div aria-hidden className="grid h-full place-items-center">
                      <span className="display-num text-[7rem] text-ink-muted/40">{m.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-[clamp(1.8rem,3vw,2.5rem)] text-ink">{m.name}</h2>
                  <p className="mt-2 text-gold">{m.role}</p>
                  <div className="mt-6">
                    <Markdown source={m.body} format="md" />
                  </div>
                  <ul className="mt-8 flex flex-wrap gap-2">
                    {m.credentials.map((c) => (
                      <li key={c} className="rounded-pill border border-line px-3 py-1.5 text-xs text-ink-secondary">
                        {c}
                      </li>
                    ))}
                  </ul>
                  {m.linkedin ? (
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-block text-sm text-ink underline decoration-gold underline-offset-4"
                    >
                      LinkedIn
                    </a>
                  ) : null}
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </Section>

      <CtaBand title="Meet us at Powai Plaza, or on a call. Either way, bring your statements." intent="call-plabita" label="Talk to Plabita" />
    </>
  );
}
