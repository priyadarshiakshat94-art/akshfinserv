// The Family Money Guide (/family-finances): one list of its sections, so the guide's contents,
// the One-Page Test results, articles and offerings all point at the same anchors.

export const GUIDE_PATH = "/family-finances";
export const WORKBOOK_PDF = "/downloads/aksh-finserv-family-money-workbook.pdf";

export const GUIDE_SECTIONS = [
  { id: "investments", label: "What we have", n: "01" },
  { id: "insurance", label: "What we're covered for", n: "02" },
  { id: "loans", label: "What we owe", n: "03" },
  { id: "goals", label: "What it's for", n: "04" },
  { id: "dates", label: "When we'll need it", n: "05" },
  { id: "nominees", label: "Who receives it", n: "06" },
  { id: "who-knows", label: "Who at home knows", n: "07" },
  { id: "life-changes", label: "When life changes", n: "" },
  { id: "parents", label: "For your parents", n: "" },
  { id: "after-a-death", label: "After a death in the family", n: "" },
  { id: "review", label: "Keeping it current", n: "" },
  { id: "questions", label: "Questions", n: "" },
] as const;

export type GuideSectionId = (typeof GUIDE_SECTIONS)[number]["id"];

export const guideHref = (id: GuideSectionId) => `${GUIDE_PATH}#${id}`;

// One-Page Test areas (lib/one-page.ts) → the guide section that explains each one.
export const AREA_TO_SECTION: Record<string, GuideSectionId> = {
  Investments: "investments",
  Insurance: "insurance",
  Loans: "loans",
  Goals: "goals",
  Dates: "dates",
  Nominees: "nominees",
  "Family access": "who-knows",
};
