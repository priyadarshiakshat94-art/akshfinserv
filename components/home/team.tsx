import Image from "next/image";
import Link from "next/link";
import { getAllTeam } from "@/lib/content";
import { Section, SectionHeading } from "@/components/site/section";
import { FadeIn } from "@/components/motion/fade-in";
import { publicFileExists } from "@/lib/assets";

export function Team() {
  const team = getAllTeam().slice(0, 3);

  return (
    <Section>
      <SectionHeading
        eyebrow="The people"
        title="Three advisors. You will know each of them by name."
        aside={
          <Link href="/about" className="text-ink underline decoration-line-hover underline-offset-4 hover:decoration-gold">
            Read full bios
          </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        {team.map((m, i) => (
          <FadeIn key={m.slug} delay={i * 0.05}>
            <article className="card-lift flex h-full flex-col rounded-card bg-elevated p-3">
              <div className="relative aspect-[4/3.6] overflow-hidden rounded-[calc(var(--radius-card)-8px)] bg-elevated-2">
                {publicFileExists(m.photo) ? (
                  <Image
                    src={m.photo}
                    alt={m.photoAlt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover grayscale-[35%]"
                  />
                ) : (
                  <div aria-hidden className="grid h-full place-items-center">
                    <span className="display-num text-[6rem] text-ink-muted/40">
                      {m.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col px-5 pb-5 pt-6">
                <h3 className="text-2xl text-ink">{m.name}</h3>
                <p className="mt-1 text-sm text-gold">{m.role}</p>
                <p className="mt-4 text-[0.95rem] text-ink-secondary">{m.shortBio}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {m.credentials.slice(0, 2).map((c) => (
                    <li key={c} className="rounded-pill border border-line px-3 py-1 text-xs text-ink-secondary">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
