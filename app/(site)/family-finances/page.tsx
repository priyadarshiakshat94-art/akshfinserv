import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "next-seo";
import { BUSINESS, SITE_URL } from "@/lib/site";
import { GUIDE_PATH } from "@/lib/family-guide";
import { GuideNav } from "@/components/guide/guide-nav";
import { GuideTracker } from "@/components/guide/guide-tracker";
import { WorkbookForm } from "@/components/guide/workbook-form";

const PUBLISHED = "2026-11-20";
const TITLE = "How to Organise Your Family's Finances in India | Aksh Finserv";
const DESCRIPTION =
  "A free, practical guide to putting your family's money in one place: investments, insurance, loans, goals, nominees, and who at home can find it.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: GUIDE_PATH },
  openGraph: {
    title: "The Family Money Guide | Aksh Finserv",
    description: DESCRIPTION,
    url: GUIDE_PATH,
    type: "article",
    images: ["/images/family-finances/family-money-seven-lines.png"],
  },
};

/* ---------- small building blocks ---------- */

function Part({
  id,
  n,
  title,
  lead,
  children,
}: {
  id: string;
  n?: string;
  title: string;
  // The short, direct answer to the heading's question. Shown first so readers and AI answers get it at once.
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-20 border-t border-line pt-12 lg:scroll-mt-8">
      {n ? <p className="eyebrow mb-4">Line {n}</p> : null}
      <h2 id={`${id}-h`} className="text-[clamp(1.8rem,3.4vw,2.6rem)] text-ink">
        {title}
      </h2>
      {lead ? <p className="mt-6 max-w-[42rem] text-lg leading-relaxed text-ink">{lead}</p> : null}
      <div className="prose-aksh mt-6">{children}</div>
    </section>
  );
}

function WriteDown({ items }: { items: string[] }) {
  return (
    <div className="not-prose rounded-[20px] border border-line bg-elevated p-6">
      <p className="eyebrow mb-3">Write down</p>
      <ul className="grid gap-2 text-[0.95rem] text-ink-secondary">
        {items.map((i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden className="mt-1 size-4 shrink-0 rounded-[4px] border border-gold/70" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Deeper({ section, links }: { section: string; links: { href: string; title: string; note: string }[] }) {
  return (
    <div className="not-prose grid gap-3 sm:grid-cols-2">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          data-track="hub_card_click"
          data-section={section}
          data-dest={l.href}
          className="group grid gap-1 rounded-[20px] bg-elevated-2 p-5 transition-colors duration-200 hover:bg-[#2b2b2b]"
        >
          <span className="text-xs uppercase tracking-[0.16em] text-gold">Go deeper</span>
          <span className="flex items-start justify-between gap-3 text-ink">
            {l.title}
            <ArrowRight className="mt-1 size-4 shrink-0 text-ink-secondary transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
          </span>
          <span className="text-sm text-ink-secondary">{l.note}</span>
        </Link>
      ))}
    </div>
  );
}

function Source({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <div className="not-prose">
      <p className="text-xs text-ink-muted">
        Source:{" "}
        <a href={href} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-ink-secondary">
          {children}
          <ArrowUpRight className="ml-0.5 inline size-3" strokeWidth={1.75} />
        </a>
      </p>
    </div>
  );
}

function Diagram({ src, alt, caption, w, h }: { src: string; alt: string; caption: string; w: number; h: number }) {
  return (
    <figure className="not-prose">
      <Image src={src} alt={alt} width={w} height={h} unoptimized className="h-auto w-full rounded-[20px]" />
      <figcaption className="mt-3 text-sm text-ink-muted">{caption}</figcaption>
    </figure>
  );
}

/* ---------- page ---------- */

const LIFE_CHANGES: [string, string][] = [
  ["You get married", "Nominees on every account and policy. KYC, if a name or address changes. Each other's loans and policies go on one page."],
  ["A child is born", "Health cover for the child. A goal with a year next to it, such as school or college. Nominees, if you want the child included."],
  ["You change jobs", "Employer health and life cover usually stop when the job does, so check what replaces them. Move or note your PF account."],
  ["You move home", "Address and KYC with fund houses, insurers and banks. Check that statements and alerts reach your current phone number and email."],
  ["You buy a home", "The home loan goes on the page. Check that life cover would still let the family keep paying it."],
  ["Someone retires", "Health cover outside an employer. Which money pays the monthly bills, and which can stay invested for later years."],
  ["Someone in the family dies", "See the section below. Then check your own accounts: any that named that person as nominee need a new one."],
];

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Is a Consolidated Account Statement (CAS) enough to see all our investments?",
    a: "It's the best place to start for mutual funds, and the depository version also covers shares and bonds in your demat account. It doesn't show insurance, loans, provident fund, NPS or bank deposits, and it can't tell you what each investment is for or who at home knows about it.",
  },
  {
    q: "Should the page be on paper or on the phone?",
    a: "Whichever the other person at home can reach without your phone and your passwords. For many families that means one printed copy in a known place, plus a copy in a shared folder or DigiLocker.",
  },
  {
    q: "What if my spouse or parents don't want to talk about money?",
    a: "Start with the practical worry, not with amounts: \"If something happened to me, would you know who to call?\" Show them the page rather than asking about theirs. Most of the page is names and places, not numbers.",
  },
  {
    q: "Is this the same as a financial plan?",
    a: "No. The page is a record of what exists, what it's for and who can find it. A plan decides what to change. It's much easier to make good decisions once the record exists.",
  },
  {
    q: "Do I need a distributor or adviser to do this?",
    a: "No. Everything in this guide can be done yourself. Some families prefer to sit with someone who does this every week. That's what our first meeting is.",
  },
  {
    q: "How is Aksh Finserv paid?",
    a: "We're an AMFI-registered mutual fund distributor. Fund houses pay us a trail commission on regular plans, which is included in each scheme's expense ratio, and insurers pay a commission on policies. If you ask, we'll show you exactly what we earn on your holdings.",
  },
];

export default function FamilyFinancesPage() {
  return (
    <>
      <GuideTracker />
      <article>
        <header className="page-fade mx-auto w-full max-w-[1320px] px-5 pb-12 pt-14 sm:px-8 lg:pb-16 lg:pt-24">
          <p className="eyebrow mb-6">The Family Money Guide</p>
          <h1 className="max-w-[56rem] text-[clamp(2.6rem,6vw,5rem)] text-ink">Your family&apos;s money, in one place</h1>
          <p className="mt-6 max-w-[42rem] text-lg text-ink-secondary">
            Most families who come to us have done plenty right with money, in plenty of different places. This guide
            shows how to bring it together in seven lines: what you have, what it&apos;s for, when you&apos;ll need it, who
            the nominees are, and who at home can find it.
          </p>
          <p className="mt-4 max-w-[42rem] text-ink-secondary">
            It takes fifteen minutes to read and an evening to do. Nothing here asks for your details.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/one-page"
              data-track="hub_card_click"
              data-section="hero"
              data-dest="/one-page"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-pill bg-gold px-7 font-medium text-ink-dark transition-colors duration-200 hover:bg-gold-hover"
            >
              Take the One-Page Test (2 minutes)
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
            </Link>
            <a href="#start" className="inline-flex h-14 items-center justify-center px-4 text-ink-secondary hover:text-ink">
              Or start reading
            </a>
          </div>
          <p className="mt-10 text-sm text-ink-muted">
            Written by the team at Aksh Finserv, led by{" "}
            <Link href="/about#plabita" className="text-ink underline-offset-4 hover:underline">
              Plabita Priyadarshi
            </Link>
            . Aksh Finserv is an AMFI-registered Mutual Fund Distributor, ARN-121998, in Powai since 2004. Published{" "}
            <time dateTime={PUBLISHED}>20 November 2026</time>.
          </p>
        </header>

        <GuideNav variant="mobile" />

        <div className="mx-auto grid w-full max-w-[1320px] gap-10 px-5 pb-20 pt-8 sm:px-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 lg:pt-0">
          <div className="hidden lg:block">
            <GuideNav variant="desktop" />
          </div>

          <div className="grid max-w-[44rem] gap-14">
            {/* Start here */}
            <section id="start" aria-labelledby="start-h" className="scroll-mt-20 lg:scroll-mt-8">
              <h2 id="start-h" className="text-[clamp(1.8rem,3.4vw,2.6rem)] text-ink">
                Start here
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { href: "/one-page", t: "See where your family stands", d: "Seven questions, two minutes, no sign-up.", s: "start" },
                  { href: "#parents", t: "I'm doing this for my parents", d: "How to start, and what to look for.", s: "start" },
                  { href: "#after-a-death", t: "Someone in the family has died", d: "What to do first, and what can wait.", s: "start" },
                ].map((c) => (
                  <Link
                    key={c.t}
                    href={c.href}
                    data-track="hub_card_click"
                    data-section={c.s}
                    data-dest={c.href}
                    className="grid gap-2 rounded-[20px] border border-line bg-elevated p-5 transition-colors duration-200 hover:border-line-hover"
                  >
                    <span className="text-ink">{c.t}</span>
                    <span className="text-sm text-ink-secondary">{c.d}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-10">
                <Diagram
                  src="/images/family-finances/family-money-seven-lines.svg"
                  alt="One page divided into seven lines: investments, insurance, loans, goals, dates, nominees, and who knows where it is."
                  caption="Everything a family needs to see, on one page. The first three lines are what you have and owe. The last four are what most lists leave out."
                  w={1600}
                  h={1000}
                />
              </div>
            </section>

            <Part
              id="investments" n="01" title="What do we have?"
              lead="List every account and investment in the family, one line each: the provider, whose name it's in, and where the statement is kept. A Consolidated Account Statement covers your mutual funds; the rest you add by hand."
            >
              <p>
                Start with a list, not a valuation. Add the last four digits of each account or folio; amounts can come
                later, or not at all.
              </p>
              <p>You don&apos;t need to remember everything. Most of it is on statements you can ask for:</p>
              <ul>
                <li>
                  <strong>Mutual funds:</strong> a Consolidated Account Statement (CAS) lists the funds held under your PAN
                  across fund houses. You can request it from CAMS, KFintech or MF Central. The version from NSDL or CDSL
                  also shows shares and bonds in your demat account.
                </li>
                <li>
                  <strong>Provident fund and NPS:</strong> your EPFO passbook and your NPS statement.
                </li>
                <li>
                  <strong>Bank deposits:</strong> net banking or the passbook, bank by bank. FDs opened at a branch years
                  ago are easy to miss.
                </li>
                <li>
                  <strong>Everything else:</strong> PPF, post office schemes, gold, property and any shares still held as
                  paper certificates go on by hand.
                </li>
              </ul>
              <WriteDown items={["Provider", "Whose name it's in, and any joint holder", "Last four digits of the account or folio", "Where the statement or document is kept"]} />
              <Source href="https://www.mfcentral.com/">MF Central, run by CAMS and KFintech</Source>
              <Deeper
                section="investments"
                links={[
                  {
                    href: "/insights/family-money-on-one-page",
                    title: "Make your family's page, step by step",
                    note: "The full method, with an illustrative page for a Powai household.",
                  },
                ]}
              />
            </Part>

            <Part
              id="insurance" n="02" title="What are we covered for?"
              lead="List every life and health policy with who it covers and when it renews, then work out what the policies would pay if the main earner died or someone needed hospital care."
            >
              <p>
                List every policy, including old ones still being paid by standing instruction. For each, note the insurer,
                the type, who is covered, the yearly premium, and the renewal or maturity date.
              </p>
              <p>Then sort them into two groups:</p>
              <ul>
                <li>
                  <strong>Protection:</strong> term life and health cover. These pay out when something goes wrong.
                </li>
                <li>
                  <strong>Savings-type policies:</strong> endowment, money-back and ULIPs. These mix some cover with
                  investment.
                </li>
              </ul>
              <p>
                Now ask two plain questions. If the main earner died this year, how much would the policies pay, and for how
                long would it last? If someone needed hospital care next month, which policy would pay, and up to what
                limit?
              </p>
              <p>
                Health cover from an employer usually ends when the job does. Check whether the family has cover of its own
                as well. If your policies are held in an electronic insurance account (eIA), that account lists them in one
                place.
              </p>
              <WriteDown items={["Insurer and policy type", "Who is covered", "Yearly premium and due month", "Renewal or maturity date", "Where the policy document is"]} />
              <Deeper
                section="insurance"
                links={[
                  {
                    href: "/insights/cost-of-surrendering-traditional-policy",
                    title: "Thinking of surrendering an old policy?",
                    note: "What surrender pays, and the options to compare first.",
                  },
                  { href: "/offerings/insurance", title: "How we help with insurance", note: "Life and health cover, reviewed with the family." },
                ]}
              />
            </Part>

            <Part
              id="loans" n="03" title="What do we owe?"
              lead="Write down every loan in the family with its lender, monthly EMI, amount outstanding and end date, including loans against policies, gold or funds, and any loan you have guaranteed."
            >
              <p>
                One line per loan: lender, EMI, the amount outstanding, and the month it ends. Include loans against a
                policy, gold or mutual funds, and any loan where you are a co-borrower or guarantor.
              </p>
              <p>
                A credit report from a credit bureau lists the loans and cards in your name, which helps catch anything
                you&apos;ve forgotten.
              </p>
              <p>
                Loans belong on the page because EMIs don&apos;t pause when income does. Add up the monthly EMIs: that number
                tells you how much the household has to find every month, whatever happens.
              </p>
              <WriteDown items={["Lender and type of loan", "Monthly EMI", "Amount outstanding", "Month and year it ends", "Co-borrower or guarantor, if any"]} />
              <Deeper
                section="loans"
                links={[
                  {
                    href: "/insights/loan-against-mutual-funds-vs-breaking-sip",
                    title: "Need cash? Borrow against your funds, or sell?",
                    note: "The four questions that decide it.",
                  },
                  { href: "/calculators/loan-vs-liquidate", title: "Loan vs liquidate calculator", note: "Compare the cost of each, with your own numbers." },
                ]}
              />
            </Part>

            <Part
              id="goals" n="04" title="What is the money for?"
              lead="Every investment should have a job: a named goal such as retirement, a child's college or emergencies. Money with no goal is the first thing to review."
            >
              <p>
                Give every holding a job. Start with up to three goals, in plain words: &ldquo;our daughter&apos;s
                college&rdquo;, &ldquo;retirement&rdquo;, &ldquo;emergencies&rdquo;. Then write the goal next to each
                investment that&apos;s meant for it.
              </p>
              <p>
                Anything left without a job deserves a second look. Money with no purpose tends to sit untouched for years
                or get spent on the next big purchase.
              </p>
              <p>
                Emergency money is a goal too. Write down where it is and who can get to it quickly if you can&apos;t.
              </p>
              <WriteDown items={["Up to three goals, in plain words", "Who each goal is for", "Which holdings are meant for which goal", "Where the emergency money is"]} />
              <Deeper
                section="goals"
                links={[
                  { href: "/calculators/sip", title: "SIP calculator", note: "What a monthly amount could grow to, at a rate you choose." },
                  { href: "/calculators/retirement", title: "Retirement calculator", note: "Roughly how large the corpus may need to be." },
                ]}
              />
            </Part>

            <Part
              id="dates" n="05" title="When will we need it?"
              lead="Put a year next to each goal. Money needed within about three years usually needs to be steady; money for goals seven or more years away can usually ride out market falls."
            >
              <p>
                Put a year next to each goal. A rough one is fine: &ldquo;college, 2034&rdquo;. The year matters because it
                decides what kind of money the goal can sit in.
              </p>
              <Diagram
                src="/images/family-finances/family-goals-time-horizon.svg"
                alt="Timeline showing family goals grouped by when the money is needed: within three years, three to seven years, and more than seven years."
                caption="When you need the money decides how much short-term ups and downs it can live with."
                w={1600}
                h={1000}
              />
              <ul>
                <li>
                  <strong>Within about three years:</strong> money that has to be there on a date usually belongs somewhere
                  steady. There may not be time to wait for markets to recover from a fall.
                </li>
                <li>
                  <strong>Three to seven years:</strong> usually a mix, moved towards steadier options as the date comes
                  closer.
                </li>
                <li>
                  <strong>Seven years or more:</strong> there&apos;s usually time to ride out falls, which is why long goals
                  are often linked to equity.
                </li>
              </ul>
              <p>
                These are general principles, not a recommendation for any product. The right mix depends on the family, the
                goal and how much uncertainty you can live with.
              </p>
              <Deeper
                section="dates"
                links={[
                  {
                    href: "/insights/sip-in-a-down-market",
                    title: "Why your SIP is not the enemy in a down market",
                    note: "What a pause really costs, in plain arithmetic.",
                  },
                ]}
              />
            </Part>

            <Part
              id="nominees" n="06" title="Who receives it?"
              lead="A nominee is the person who receives an account or policy when the holder dies. Check that every investment, policy, bank account, PF and NPS account names a nominee you would still choose today."
            >
              <p>Look for three things:</p>
              <ul>
                <li>no nominee at all;</li>
                <li>a nominee who has since died, or a relationship that has changed;</li>
                <li>different accounts naming different people, without a reason you&apos;d still stand by.</li>
              </ul>
              <p>
                For mutual funds and demat accounts, the quickest check is your statement. Under SEBI&apos;s current rules,
                in force since 1 September 2026, each account statement shows either the nominees&apos; names or simply
                whether a nomination exists, depending on what you chose.
              </p>
              <p>
                The same rules let you name up to three nominees on a folio or demat account, with a percentage for each.
                If you don&apos;t give percentages, the holding is split equally. You can change a nomination as often as you
                like, online or on paper, but a joint account needs every holder to agree. For policies, bank accounts and
                PF, it&apos;s a form or an online request with the insurer, bank or EPFO.
              </p>
              <p>
                Opting out has a cost. Without a nominee, legal heirs may need extra legal or court documents before
                anything is transferred, and holdings that nobody claims for a long time can end up with the Investor
                Education and Protection Fund.
              </p>
              <p>
                A nominee receives the money, but that isn&apos;t always the same as being entitled to keep it. If there is a
                will, or legal heirs with a claim, the nominee may be holding it on their behalf. The rules differ by type
                of asset. If your family situation is complicated, ask a lawyer before relying on nominations alone.
              </p>
              <WriteDown items={["The nominee on each account and policy", "Any account with no nominee", "Whether you have a will, and where it is"]} />
              <Source href="https://www.sebi.gov.in/sebi_data/attachdocs/jun-2026/1780397706130.pdf">
                SEBI circular, Modified Norms for Nomination in Demat Accounts and Mutual Fund Folios (29 May 2026,
                effective 1 September 2026)
              </Source>
            </Part>

            <Part
              id="who-knows" n="07" title="Could someone at home find it?"
              lead="At least one other adult at home should know the page exists, where it is kept and who to call, without needing your phone or your passwords."
            >
              <p>
                Pick one person, usually a spouse or a grown-up child. Show them the page and where it&apos;s kept, and talk
                them through it once. It takes about twenty minutes.
              </p>
              <ul>
                <li>
                  <strong>Share:</strong> the page, where the documents are, and who to call: your distributor, insurance
                  agent, CA and lawyer.
                </li>
                <li>
                  <strong>Never share or write down:</strong> passwords, PINs, OTPs or full card numbers.
                </li>
              </ul>
              <p>
                DigiLocker can help too. Since April 2025 you can keep your mutual fund and demat statements, including your
                CAS, in DigiLocker and name a DigiLocker nominee. If you die, that person is told and can see the record of
                your financial holdings. It doesn&apos;t replace the nominee on the folio or demat account; it helps your
                family find what exists.
              </p>
              <Source href="https://www.sebi.gov.in/legal/circulars/mar-2025/harnessing-digilocker-as-a-digital-public-infrastructure-for-reducing-unclaimed-assets-in-the-indian-securities-market_92769.html">
                SEBI, Harnessing DigiLocker for reducing unclaimed assets (19 March 2025)
              </Source>
            </Part>

            {/* Workbook */}
            <section id="workbook" aria-labelledby="workbook-h" className="scroll-mt-20 rounded-card border border-line bg-elevated p-7 sm:p-10 lg:scroll-mt-8">
              <p className="eyebrow mb-4">Free workbook</p>
              <h2 id="workbook-h" className="text-[clamp(1.7rem,3vw,2.3rem)] text-ink">
                Take the guide with you
              </h2>
              <p className="mt-4 max-w-[36rem] text-ink-secondary">
                The Family Money Workbook is 13 printable pages that follow the seven lines, plus a short section for your
                parents and a yearly review. You fill it in by hand. It never asks for balances, account numbers or
                passwords.
              </p>
              <div className="mt-7">
                <WorkbookForm placement="after-line-7" />
              </div>
            </section>

            <Part id="life-changes" title="When life changes, update the page">
              <p>Once a year is enough for most families. Update sooner after any of these:</p>
              <div className="prose-table">
                <table>
                  <thead>
                    <tr>
                      <th>What happened</th>
                      <th>What to check</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LIFE_CHANGES.map(([e, c]) => (
                      <tr key={e}>
                        <td>{e}</td>
                        <td>{c}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Part>

            <Part
              id="parents" title="Doing this for your parents"
              lead="Start with what you're worried about, not with what they have, and find out where things are over a few conversations: banks, policies, old investments, contact details and what pays their bills."
            >
              <p>
                A line that usually opens the conversation: &ldquo;If something happened, I wouldn&apos;t know who to
                call.&rdquo; It&apos;s a question about where things are, not how much there is.
              </p>
              <p>What to find out:</p>
              <ul>
                <li>Which banks they use, and whether each account has a joint holder or nominee.</li>
                <li>Which insurers, and where the policy papers are.</li>
                <li>Older investments: paper share certificates, old mutual fund folios, post office schemes.</li>
                <li>Whether statements and alerts still reach a phone number and email they use.</li>
                <li>What pays their monthly bills, and how long that money is meant to last.</li>
                <li>Who they would call: their agent, CA or lawyer.</li>
              </ul>
              <p>Two official tools help when something may have been forgotten:</p>
              <ul>
                <li>
                  <strong>MITRA</strong>, launched under SEBI in 2025 and run by CAMS and KFintech, searches for mutual fund
                  folios with no investor activity for ten years or more. It&apos;s reachable through MF Central.
                </li>
                <li>
                  <strong>UDGAM</strong>, the RBI&apos;s portal, searches for unclaimed bank deposits across participating
                  banks.
                </li>
              </ul>
              <Source href="https://udgam.rbi.org.in/">RBI UDGAM portal</Source>
            </Part>

            <Part
              id="after-a-death" title="When someone in the family has died"
              lead="Get copies of the death certificate, find out what existed, then ask each bank, fund house and insurer for its claim process. Very little has to be done in the first weeks."
            >
              <p>A sensible order:</p>
              <ol>
                <li>Get several copies of the death certificate. Almost every claim needs one.</li>
                <li>
                  Find out what existed. Look through their papers, bank statements, and emails or messages from fund houses
                  and insurers. If you were named as their DigiLocker nominee, DigiLocker can show you their holdings. MITRA
                  and UDGAM help with anything older.
                </li>
                <li>
                  Contact each provider and ask for its claim or transmission process. A nominee usually needs the death
                  certificate, their own KYC and a claim form. Legal heirs without a nomination may be asked for more, such as
                  a succession certificate or a copy of the will.
                </li>
                <li>Keep a simple list of what you filed, where, and when, so nothing is done twice.</li>
              </ol>
              <div className="not-prose flex flex-col gap-4 rounded-[20px] border border-line bg-elevated p-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-ink-secondary">
                  If you&apos;d like someone to go through it with you, call us. You don&apos;t need to fill in a form first.
                </p>
                <a
                  href={`tel:${BUSINESS.phoneE164}`}
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-pill border border-line px-6 text-sm text-ink hover:border-line-hover"
                >
                  <Phone className="size-4" strokeWidth={1.75} /> {BUSINESS.phoneDisplay}
                </a>
              </div>
            </Part>

            <Part id="review" title="Keeping it current">
              <p>A page that isn&apos;t updated slowly stops being true. Five moments a year are enough:</p>
              <Diagram
                src="/images/family-finances/family-money-review-calendar.svg"
                alt="A year with five moments to review family finances: after the Union Budget in February, before 31 March, when filing tax returns, on a family review date, and when policies renew."
                caption="Five check-ins a year keep the page current."
                w={1600}
                h={1000}
              />
              <ul>
                <li>
                  <strong>February:</strong> after the Union Budget, check whether any tax change affects what you hold.
                </li>
                <li>
                  <strong>Before 31 March:</strong> statements are being gathered for the financial year anyway.
                </li>
                <li>
                  <strong>When you file your tax return:</strong> income, interest and capital gains are all in front of
                  you.
                </li>
                <li>
                  <strong>One date the family will remember:</strong> an anniversary or a birthday, for the full review
                  together.
                </li>
                <li>
                  <strong>Each policy renewal:</strong> check the cover and the nominee before paying.
                </li>
              </ul>
            </Part>

            <section id="questions" aria-labelledby="questions-h" className="scroll-mt-20 border-t border-line pt-12 lg:scroll-mt-8">
              <h2 id="questions-h" className="text-[clamp(1.8rem,3.4vw,2.6rem)] text-ink">
                Questions people ask
              </h2>
              <div className="mt-6 grid gap-8">
                {FAQS.map((f) => (
                  <div key={f.q}>
                    <h3 className="font-display text-xl text-ink">{f.q}</h3>
                    <p className="mt-2 text-[1.0625rem] leading-relaxed text-[#c9c6c0]">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Final */}
            <section aria-labelledby="help-h" className="grid gap-8 rounded-card bg-gold p-8 text-ink-dark sm:p-10">
              <div>
                <h2 id="help-h" className="text-[clamp(1.8rem,3.2vw,2.5rem)]">
                  When it gets complicated
                </h2>
                <p className="mt-4 max-w-[34rem] text-[#3b3427]">
                  Some pages are simple. Others have a policy nobody can explain, a parent&apos;s old folios, or money in
                  three names. If yours is the second kind, talk it through with us. A first call takes about 30 minutes.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact?intent=family-guide"
                  data-track="hub_card_click"
                  data-section="final"
                  data-dest="/contact"
                  className="group inline-flex h-14 items-center justify-center gap-2 rounded-pill bg-ink-dark px-7 font-medium text-surface-light hover:bg-black"
                >
                  Talk to Plabita
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
                </Link>
                <Link
                  href="/one-page"
                  data-track="hub_card_click"
                  data-section="final"
                  data-dest="/one-page"
                  className="inline-flex h-14 items-center justify-center rounded-pill border border-ink-dark/30 px-7 font-medium hover:border-ink-dark"
                >
                  Or take the One-Page Test first
                </Link>
              </div>
            </section>

            <section aria-labelledby="workbook2-h" className="rounded-card border border-line bg-elevated p-7 sm:p-10">
              <h2 id="workbook2-h" className="text-2xl text-ink">
                Want this on paper?
              </h2>
              <p className="mt-3 text-ink-secondary">We&apos;ll email you the 13-page Family Money Workbook.</p>
              <div className="mt-6">
                <WorkbookForm placement="end" />
              </div>
            </section>

            <aside className="rounded-card bg-elevated p-6 text-xs leading-relaxed text-ink-muted">
              <p>
                Aksh Finserv is an AMFI-registered Mutual Fund Distributor (ARN-121998). We are not a SEBI-registered
                investment adviser. This guide is general information, not a recommendation to buy, sell or hold any
                product, and not legal or tax advice. Rules change; check the source before acting on any of them.
              </p>
              <p className="mt-2">
                Mutual fund investments are subject to market risks. Read all scheme related documents carefully before
                investing.
              </p>
              <p className="mt-2">
                How this guide was made: written and checked by our team against the official sources linked on this page.
                We used AI tools to help with research and drafting.
              </p>
            </aside>
          </div>
        </div>

        <ArticleJsonLd
          useAppDir
          url={`${SITE_URL}${GUIDE_PATH}`}
          title="Your family's money, in one place: The Family Money Guide"
          description={DESCRIPTION}
          images={[`${SITE_URL}/images/family-finances/family-money-seven-lines.png`]}
          datePublished={PUBLISHED}
          dateModified={PUBLISHED}
          authorName="Plabita Priyadarshi"
          publisherName="Aksh Finserv"
        />
        <BreadcrumbJsonLd
          useAppDir
          itemListElements={[
            { position: 1, name: "Home", item: SITE_URL },
            { position: 2, name: "The Family Money Guide", item: `${SITE_URL}${GUIDE_PATH}` },
          ]}
        />
      </article>
    </>
  );
}
