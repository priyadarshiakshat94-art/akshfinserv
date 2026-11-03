// The One-Page Test: seven questions about where a family's financial records are, never amounts.
// Scoring measures organisation and visibility only. It is not a view on investments, risk or suitability.

export type Answer = "yes" | "partly" | "no" | "unsure";

export const ANSWERS: { value: Answer; label: string; points: number; tag: string }[] = [
  { value: "yes", label: "Yes, all in one place", points: 2, tag: "In place" },
  { value: "partly", label: "Partly", points: 1, tag: "Partly" },
  { value: "no", label: "Not yet", points: 0, tag: "Missing" },
  { value: "unsure", label: "I'm not sure", points: 0, tag: "Not sure" },
];

export const QUESTIONS = [
  {
    area: "Investments",
    text: "Could you list all your investments, from mutual funds and shares to FDs, PPF and NPS, from one place?",
    why: "Most people hold them across several apps, banks and paper records.",
    fix: "Gather your investments in one list",
    how: "For mutual funds, a Consolidated Account Statement (CAS) lists every folio in one document. Add shares, FDs, PPF and NPS by hand.",
  },
  {
    area: "Insurance",
    text: "Do you have one record of every insurance policy you and your family hold, with renewal dates?",
    why: "Policies bought years apart often live in different drawers and inboxes.",
    fix: "List every policy on one sheet",
    how: "Insurer, type of cover, who is covered, premium and renewal date. Keep the PDFs in one folder.",
  },
  {
    area: "Loans",
    text: "Do you know every loan and EMI you are paying, and when each one ends?",
    why: "EMIs are easy to pay and easy to lose track of.",
    fix: "Write down each loan in one line",
    how: "Lender, EMI, outstanding amount and end date, taken from your latest statements.",
  },
  {
    area: "Goals",
    text: "Have you written down what you're saving for, such as retirement, a child's education or a home?",
    why: "A goal that's only discussed tends to stay 'someday'.",
    fix: "Name up to three goals",
    how: "One line each: what it is and who it's for. Keep it short.",
  },
  {
    area: "Dates",
    text: "For each goal, do you know roughly the year you'll need the money?",
    why: "A year turns a wish into something you can plan for.",
    fix: "Put a year next to each goal",
    how: "A rough year is fine, for example 'college, 2034'.",
  },
  {
    area: "Nominees",
    text: "Are nominees up to date on your investments, policies and bank accounts?",
    why: "Life changes; nominee forms often don't.",
    fix: "Check every nominee",
    how: "Look at each investment, policy and bank account, and update any that are missing or out of date.",
  },
  {
    area: "Family access",
    text: "If something happened to you, could your family find all of this?",
    why: "The page only helps if the people who need it can find it.",
    fix: "Tell one person where your page is",
    how: "Share where it's kept and who to call. You don't need to share passwords.",
  },
] as const;

export const MAX_POINTS = QUESTIONS.length * 2;

export const BANDS = [
  {
    max: 5,
    name: "Scattered",
    text: "Most of your financial life isn't in one place yet. That's common, and the fix is simple: one page, filled in a little at a time.",
  },
  {
    max: 10,
    name: "Partly on one page",
    text: "Some of it is in one place and some isn't. The gaps below are usually an afternoon's work.",
  },
  {
    max: MAX_POINTS,
    name: "Nearly on one page",
    text: "You can see most of it already. The last few items are the ones families most often miss.",
  },
];

export function pointsFor(answers: (Answer | null)[]) {
  return answers.reduce((sum, a) => sum + (ANSWERS.find((o) => o.value === a)?.points ?? 0), 0);
}

export function bandFor(points: number) {
  return BANDS.find((b) => points <= b.max) ?? BANDS[BANDS.length - 1];
}
