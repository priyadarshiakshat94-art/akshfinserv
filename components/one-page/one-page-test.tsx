"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, BellRing, Copy, Send } from "lucide-react";
import { BookCallForm } from "@/components/site/book-call-form";
import { trackEvent } from "@/lib/track";
import { ANSWERS, BANDS, MAX_POINTS, QUESTIONS, bandFor, pointsFor, type Answer } from "@/lib/one-page";
import { cn } from "@/lib/utils";

type Step = "intro" | "quiz" | "result" | "steps" | "invite" | "book";

const SHARE_URL = "https://akshfinserv.net/one-page?utm_source=share&utm_medium=referral&utm_campaign=one_page";

const DESK = [
  { label: "MF statement, March", x: -70, y: -112, r: -6 },
  { label: "Term policy (2).pdf", x: 80, y: -80, r: 5 },
  { label: "Home loan EMI schedule", x: -90, y: -36, r: 3 },
  { label: "Goals_FINAL_v3.xlsx", x: 70, y: 4, r: -4 },
  { label: "PPF passbook (photo)", x: -60, y: 52, r: -8 },
  { label: "Nominee form?", x: 90, y: 84, r: 7 },
  { label: "Papa's FD receipt", x: -20, y: 118, r: 2 },
];
const SETTLED_Y = [-78, -46, -14, 18, 50, 82, 114];

const btn =
  "group inline-flex h-14 items-center justify-center gap-2 rounded-pill px-7 font-medium transition-colors duration-200 disabled:opacity-50";
const primary = cn(btn, "bg-gold text-ink-dark hover:bg-gold-hover");
const ghost = cn(btn, "border border-line-hover text-ink hover:border-gold/60");
const quiet = "inline-flex items-center gap-2 py-2 text-sm text-ink-secondary transition-colors hover:text-ink";

// Scattered "tabs" that settle onto one page, then loosen again.
function Desk() {
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSettled(true);
      return;
    }
    const first = setTimeout(() => setSettled(true), 1200);
    const loop = setInterval(() => setSettled((s) => !s), 5200);
    return () => {
      clearTimeout(first);
      clearInterval(loop);
    };
  }, []);
  return (
    <div aria-hidden className="relative h-[320px] w-full max-w-[420px]">
      <div
        className={cn(
          "absolute inset-x-6 inset-y-4 rounded-[4px] bg-surface-light transition-all delay-500 duration-700",
          settled ? "scale-100 opacity-100" : "scale-[0.96] opacity-0",
        )}
      >
        <span className="absolute left-5 top-5 text-[10px] font-medium tracking-[0.3em] text-[#6d675d]">ONE PAGE</span>
        <span
          className={cn("absolute left-5 top-10 h-0.5 bg-gold transition-all delay-1000 duration-500", settled ? "w-14" : "w-0")}
        />
      </div>
      {DESK.map((d, i) => (
        <div
          key={d.label}
          className={cn(
            "absolute top-1/2 whitespace-nowrap rounded-lg border px-3 py-2 text-[12.5px] transition-all duration-[1100ms] ease-[cubic-bezier(.6,.05,.2,1)] motion-reduce:transition-none",
            settled ? "left-12 border-transparent bg-transparent text-[#2a2722]" : "left-1/2 border-line-hover bg-elevated text-ink",
          )}
          style={{
            transform: settled
              ? `translate(0, -50%) translateY(${SETTLED_Y[i]}px)`
              : `translate(-50%, -50%) translate(${d.x}px, ${d.y}px) rotate(${d.r}deg)`,
          }}
        >
          <span className={cn("mr-1.5", settled ? "text-gold" : "text-ink-muted")}>0{i + 1}</span>
          {d.label}
        </div>
      ))}
    </div>
  );
}

// A calendar file that reminds the visitor to update their page in six months.
function downloadReminder() {
  const d = new Date();
  d.setMonth(d.getMonth() + 6);
  const day = [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("");
  const next = new Date(d);
  next.setDate(next.getDate() + 1);
  const dayAfter = [next.getFullYear(), String(next.getMonth() + 1).padStart(2, "0"), String(next.getDate()).padStart(2, "0")].join("");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aksh Finserv//One-Page Test//EN",
    "BEGIN:VEVENT",
    `UID:one-page-${stamp}@akshfinserv.net`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${day}`,
    `DTEND;VALUE=DATE:${dayAfter}`,
    "SUMMARY:Update my one page",
    "DESCRIPTION:Check your investments\\, policies\\, loans\\, goals\\, dates\\, nominees and who knows where your page is. Retake the test at https://akshfinserv.net/one-page",
    "BEGIN:VALARM",
    "TRIGGER:PT9H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Update my one page",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "update-my-one-page.ics";
  a.click();
  URL.revokeObjectURL(url);
}

export function OnePageTest() {
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<(Answer | null)[]>(() => QUESTIONS.map(() => null));
  const [qi, setQi] = useState(0);
  const [note, setNote] = useState("");
  const [returnTo, setReturnTo] = useState<Step>("intro");
  const panel = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const points = pointsFor(answers);
  const band = bandFor(points);
  const answered = answers.some((a) => a !== null);
  const gaps = QUESTIONS.map((q, i) => ({ q, a: answers[i] })).filter((x) => x.a !== "yes");

  // Ads and Stories can link straight to the invitation with /one-page#invite.
  useEffect(() => {
    if (window.location.hash === "#invite") setStep("invite");
  }, []);

  // Move focus and scroll to the panel whenever the step or question changes.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    panel.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    panel.current?.querySelector<HTMLElement>("[data-focus]")?.focus({ preventScroll: true });
  }, [step, qi]);

  function go(next: Step) {
    if (next === "invite") {
      if (step !== "invite" && step !== "book") setReturnTo(step);
      trackEvent("one_page_invite_view", { from: step });
    }
    if (next === "result") trackEvent("one_page_result", { band: band.name });
    setNote("");
    setStep(next);
  }

  function start() {
    const firstOpen = answers.findIndex((a) => a === null);
    setQi(firstOpen < 0 ? 0 : firstOpen);
    trackEvent("one_page_start");
    go("quiz");
  }

  function choose(a: Answer) {
    const next = answers.map((v, i) => (i === qi ? a : v));
    setAnswers(next);
    setTimeout(() => {
      if (qi < QUESTIONS.length - 1) setQi(qi + 1);
      else {
        trackEvent("one_page_result", { band: bandFor(pointsFor(next)).name });
        setStep("result");
      }
    }, 260);
  }

  function retake() {
    setAnswers(QUESTIONS.map(() => null));
    setQi(0);
    go("quiz");
  }

  async function copyChecklist() {
    const text = ["My One-Page Test checklist (Aksh Finserv)", ...gaps.map(({ q }) => `- ${q.fix}: ${q.how}`)].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setNote("Copied. Paste it into your notes or a message to yourself.");
      trackEvent("one_page_copy");
    } catch {
      setNote("Copying didn't work here. Select the checklist above and copy it by hand.");
    }
  }

  async function share() {
    trackEvent("one_page_share");
    const data = { title: "The One-Page Test", text: "Two minutes: could you show all our finances on one page?", url: SHARE_URL };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(`${data.text} ${data.url}`);
      setNote("Link copied. Send it to the person who'd need to find your page.");
    } catch {
      /* The visitor closed the share sheet. */
    }
  }

  const topic = answered
    ? `One-Page Test: ${band.name}.` +
      (gaps.length ? ` Would like help with ${gaps.slice(0, 3).map((g) => g.q.area.toLowerCase()).join(", ")}.` : "")
    : "";

  const q = QUESTIONS[qi];

  return (
    <>
      <header className="page-fade mx-auto grid w-full max-w-[1320px] items-center gap-10 px-5 pb-12 pt-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:pb-16 lg:pt-24">
        <div>
          <p className="eyebrow mb-6">The One-Page Test</p>
          <h1 className="max-w-[44rem] text-[clamp(2.6rem,6vw,5rem)] text-ink">
            Could you show your whole financial life on one page?
          </h1>
          <p className="mt-6 max-w-[38rem] text-lg text-ink-secondary">
            Most families have their money in many places: an app, a drawer, an inbox, a relative&apos;s memory. Seven
            questions show you what&apos;s on one page and what isn&apos;t.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" className={primary} onClick={() => (step === "intro" ? start() : panel.current?.scrollIntoView({ behavior: "smooth", block: "start" }))}>
              Take the One-Page Test
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
            </button>
            <button type="button" className={ghost} onClick={() => go("invite")}>
              Talk to Plabita instead
            </button>
          </div>
          <p className="mt-6 text-sm text-ink-muted">
            <span className="text-ink">Since 2004</span> in Powai, Mumbai · <span className="text-ink">2 minutes</span>,
            no sign-up · nothing you answer is stored
          </p>
        </div>
        <div className="flex justify-center lg:justify-end">
          <Desk />
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1320px] px-5 pb-24 sm:px-8 lg:pb-32">
        <div
          ref={panel}
          id="test"
          className="mx-auto max-w-[720px] scroll-mt-24 rounded-card border border-line bg-elevated p-6 sm:p-10"
        >
          {step === "intro" ? (
            <div className="grid gap-8">
              <div>
                <p className="eyebrow mb-4">Before you start</p>
                <h2 data-focus tabIndex={-1} className="text-[clamp(1.8rem,3vw,2.5rem)] text-ink outline-none">
                  Two minutes. Seven questions. One page.
                </h2>
              </div>
              <ol className="grid gap-5">
                {[
                  ["You answer seven questions about ", "where things are", ", not how much you have. No amounts, no account numbers."],
                  ["You see ", "your page", ": what's already in one place, what's partly there and what's missing."],
                  ["You get a ", "short checklist", " to fill the gaps yourself, whether or not you ever speak to us."],
                ].map(([a, b, c], i) => (
                  <li key={b} className="grid grid-cols-[2rem_1fr] gap-3 text-ink-secondary">
                    <span className="display-num text-2xl text-gold">{i + 1}</span>
                    <span>
                      {a}
                      <span className="text-ink">{b}</span>
                      {c}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="rounded-[20px] bg-elevated-2 p-5 text-sm text-ink-secondary">
                This test looks at organisation and visibility only. It doesn&apos;t judge your investments, returns,
                risk or what suits you. Your answers stay in your browser and are not sent anywhere.
              </p>
              <button type="button" className={cn(primary, "sm:self-start")} onClick={start}>
                Start the test
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
              </button>
            </div>
          ) : null}

          {step === "quiz" ? (
            <div className="grid gap-7">
              <div className="grid gap-3">
                <div className="flex justify-between text-sm tabular-nums text-ink-secondary">
                  <span>
                    Question {qi + 1} of {QUESTIONS.length}
                  </span>
                  <span>{qi === QUESTIONS.length - 1 ? "Last one" : `About ${Math.max(1, Math.round((QUESTIONS.length - qi) / 2))} min left`}</span>
                </div>
                <div
                  className="h-[3px] overflow-hidden rounded-full bg-line-hover"
                  role="progressbar"
                  aria-label="Test progress"
                  aria-valuemin={0}
                  aria-valuemax={QUESTIONS.length}
                  aria-valuenow={qi}
                >
                  <div className="h-full bg-gold transition-[width] duration-300" style={{ width: `${(qi / QUESTIONS.length) * 100}%` }} />
                </div>
              </div>
              <div className="grid gap-3">
                <p className="eyebrow">{q.area}</p>
                <p id="one-page-q" data-focus tabIndex={-1} className="font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-tight text-ink outline-none">
                  {q.text}
                </p>
                <p className="text-sm text-ink-secondary">{q.why}</p>
              </div>
              <div role="radiogroup" aria-labelledby="one-page-q" className="grid gap-2.5">
                {ANSWERS.map((o) => {
                  const on = answers[qi] === o.value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => choose(o.value)}
                      className={cn(
                        "flex min-h-14 items-center justify-between gap-3 rounded-[18px] border px-5 py-3 text-left text-ink transition-colors",
                        on ? "border-gold bg-[#231e15]" : "border-line-hover bg-elevated-2 hover:border-ink-muted",
                      )}
                    >
                      {o.label}
                      <span
                        aria-hidden
                        className={cn("size-[18px] shrink-0 rounded-full border-[1.5px]", on ? "border-gold bg-[radial-gradient(var(--accent)_0_4px,transparent_5px)]" : "border-ink-muted")}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between">
                <button type="button" className={quiet} onClick={() => (qi > 0 ? setQi(qi - 1) : go("intro"))}>
                  <ArrowLeft className="size-4" strokeWidth={1.75} />
                  Back
                </button>
                {answers[qi] ? (
                  <button
                    type="button"
                    className={quiet}
                    onClick={() => (qi < QUESTIONS.length - 1 ? setQi(qi + 1) : go("result"))}
                  >
                    {qi === QUESTIONS.length - 1 ? "See my page" : "Next"}
                    <ArrowRight className="size-4" strokeWidth={1.75} />
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === "result" ? (
            <div className="grid gap-7">
              <div>
                <p className="eyebrow mb-4">Your result</p>
                <h2 data-focus tabIndex={-1} className="text-[clamp(1.8rem,3vw,2.5rem)] text-ink outline-none">
                  {band.name}
                </h2>
                <p className="mt-3 text-ink-secondary">{band.text}</p>
              </div>
              <div className="rounded-[8px] bg-surface-light px-5 pb-3 pt-5 text-[#24211c] sm:px-7">
                <div className="mb-1 flex items-baseline justify-between border-b-2 border-gold pb-3">
                  <span className="text-[10px] font-medium tracking-[0.3em] text-[#6d675d]">YOUR ONE PAGE</span>
                  <span className="font-display text-2xl tabular-nums">
                    {points} / {MAX_POINTS}
                  </span>
                </div>
                {QUESTIONS.map((qq, i) => {
                  const o = ANSWERS.find((x) => x.value === answers[i]);
                  return (
                    <div key={qq.area} className="flex items-center justify-between gap-3 border-b border-[#e3ddd2] py-2.5 last:border-b-0">
                      <span>{qq.area}</span>
                      <span
                        className={cn(
                          "whitespace-nowrap rounded-pill px-2.5 py-1 text-[11px] font-medium",
                          o?.value === "yes" && "bg-[#e4ead9] text-[#3d4d2b]",
                          o?.value === "partly" && "bg-[#f1e5cf] text-[#6b4f1f]",
                          o?.value === "no" && "bg-[#f6ddd5] text-[#7a3420]",
                          (o?.value === "unsure" || !o) && "bg-[#e7e3dc] text-[#55504a]",
                        )}
                      >
                        {o?.tag ?? "Skipped"}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-ink-muted">
                How this works: &ldquo;Yes, all in one place&rdquo; counts 2, &ldquo;Partly&rdquo; counts 1, &ldquo;Not yet&rdquo; and
                &ldquo;I&apos;m not sure&rdquo; count 0, out of {MAX_POINTS}. {BANDS[0].max} or less is {BANDS[0].name.toLowerCase()},{" "}
                {BANDS[1].max} or less is {BANDS[1].name.toLowerCase()}. It measures what you can see in one place, nothing else.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button type="button" className={primary} onClick={() => go("steps")}>
                  See your checklist
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
                </button>
                <button type="button" className={quiet} onClick={retake}>
                  Retake the test
                </button>
              </div>
            </div>
          ) : null}

          {step === "steps" ? (
            <div className="grid gap-7">
              <div>
                <p className="eyebrow mb-4">Your checklist</p>
                <h2 data-focus tabIndex={-1} className="text-[clamp(1.8rem,3vw,2.5rem)] text-ink outline-none">
                  What to put on your page next
                </h2>
                <p className="mt-3 text-ink-secondary">
                  {gaps.length
                    ? `${gaps.length} of ${QUESTIONS.length} items to add. Start with whichever takes five minutes.`
                    : "Everything is in one place. Keep it current: check the page once a year and after any big change at home."}
                </p>
              </div>
              <ul className="grid gap-3">
                {(gaps.length ? gaps : QUESTIONS.slice(5).map((qq) => ({ q: qq, a: "yes" as Answer }))).map(({ q: qq }) => (
                  <li key={qq.area} className="grid gap-1 rounded-[20px] bg-elevated-2 p-5">
                    <span className="font-medium text-ink">{qq.fix}</span>
                    <span className="text-sm text-ink-secondary">{qq.how}</span>
                  </li>
                ))}
              </ul>
              <div>
                <h3 className="text-xl text-ink">Questions worth asking at home</h3>
                <ol className="mt-4 grid list-decimal gap-2 pl-5 text-ink-secondary marker:text-gold">
                  <li>If one of us couldn&apos;t manage the money for three months, who would, and would they know where to start?</li>
                  <li>Which of our goals has a year attached to it, and which is still &ldquo;someday&rdquo;?</li>
                  <li>Are any of our policies or investments still in the name of someone who has moved, married or passed away?</li>
                  <li>When did we last check that our nominees are the people we&apos;d choose today?</li>
                </ol>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <button type="button" className={cn(ghost, "h-12 px-4 text-sm")} onClick={copyChecklist}>
                  <Copy className="size-4" strokeWidth={1.75} /> Copy checklist
                </button>
                <button
                  type="button"
                  className={cn(ghost, "h-12 px-4 text-sm")}
                  onClick={() => {
                    downloadReminder();
                    trackEvent("one_page_reminder");
                    setNote("Reminder saved. Open the file to add it to your calendar.");
                  }}
                >
                  <BellRing className="size-4" strokeWidth={1.75} /> Remind me in 6 months
                </button>
                <button type="button" className={cn(ghost, "h-12 px-4 text-sm")} onClick={share}>
                  <Send className="size-4" strokeWidth={1.75} /> Send to family
                </button>
              </div>
              <p role="status" aria-live="polite" className="min-h-5 text-sm text-[#b7c9a0]">
                {note}
              </p>
              <button type="button" className={cn(primary, "sm:self-start")} onClick={() => go("invite")}>
                Want a hand? Talk to Plabita
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
              </button>
            </div>
          ) : null}

          {step === "invite" ? (
            <div className="grid gap-7">
              <div>
                <p className="eyebrow mb-4">An introductory call</p>
                <h2 data-focus tabIndex={-1} className="text-[clamp(1.8rem,3vw,2.5rem)] text-ink outline-none">
                  Bring your page. Or bring the pile.
                </h2>
              </div>
              <div className="grid grid-cols-[96px_1fr] items-center gap-5">
                <Image
                  src="/images/team/plabita.jpg"
                  alt="Plabita Priyadarshi, Founder and Managing Director of Aksh Finserv"
                  width={96}
                  height={106}
                  className="h-[106px] w-24 rounded-xl object-cover object-[50%_20%] grayscale-[35%]"
                />
                <div>
                  <p className="font-display text-xl text-ink">Plabita Priyadarshi</p>
                  <p className="text-sm text-ink-secondary">
                    Founder &amp; Managing Director. Has put Powai families&apos; money on one page since 2004.
                  </p>
                </div>
              </div>
              <dl className="grid gap-5">
                {[
                  ["What it is", "A 30-minute call to understand your situation and agree on a sensible next step."],
                  ["What to bring", "Your result from this test, or simply a list of what you hold. No documents are needed for the first call."],
                  ["What we can help clarify", "What's missing from your page, which goals have dates and which don't, and how we'd organise it with you."],
                  [
                    "What it doesn't promise",
                    "It doesn't commit you to anything and it isn't a sales pitch. Aksh Finserv is an AMFI-registered Mutual Fund Distributor, not an investment adviser. Most first calls end with a clear next step, or a clear reason to wait.",
                  ],
                ].map(([t, d]) => (
                  <div key={t}>
                    <dt className="eyebrow mb-1">{t}</dt>
                    <dd className="text-ink-secondary">{d}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button type="button" className={primary} onClick={() => go("book")}>
                  Request a 30-minute call
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
                </button>
                <button type="button" className={quiet} onClick={() => go(returnTo === "invite" ? "intro" : returnTo)}>
                  <ArrowLeft className="size-4" strokeWidth={1.75} />
                  Back
                </button>
              </div>
            </div>
          ) : null}

          {step === "book" ? (
            <div className="grid gap-6">
              <div>
                <p className="eyebrow mb-4">Request a call</p>
                <h2 data-focus tabIndex={-1} className="text-[clamp(1.8rem,3vw,2.5rem)] text-ink outline-none">
                  Pick a day and a time
                </h2>
                <p className="mt-3 text-ink-secondary">
                  Monday to Saturday. We confirm every request by phone, so this is a request, not a confirmed booking.
                  {topic ? " We've started the note from your checklist; edit or clear it. Only what's in the form is sent." : ""}
                </p>
              </div>
              <BookCallForm defaultTopic={topic} source="one-page" requireConsent />
              <button type="button" className={cn(quiet, "self-start")} onClick={() => go("invite")}>
                <ArrowLeft className="size-4" strokeWidth={1.75} />
                Back
              </button>
            </div>
          ) : null}
        </div>
        <p className="mx-auto mt-6 max-w-[720px] text-xs text-ink-muted">
          This test is for organisation only and is not investment advice. Aksh Finserv is an AMFI-registered Mutual Fund
          Distributor, ARN-121998. Mutual fund investments are subject to market risks. Read all scheme related documents
          carefully.
        </p>
      </section>
    </>
  );
}
