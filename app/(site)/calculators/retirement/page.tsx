import type { Metadata } from "next";
import { CalcPage } from "@/components/calculators/calc-page";
import { RetirementCalculator } from "@/components/calculators/retirement-calculator";

export const metadata: Metadata = {
  title: "Retirement calculator",
  description: "Work out the corpus you need at retirement, what your savings will cover, and the monthly SIP that closes the gap.",
  alternates: { canonical: "/calculators/retirement" },
};

export default function RetirementPage() {
  return (
    <CalcPage
      current="/calculators/retirement"
      title="How big does the corpus need to be?"
      lede="The same four steps we walk through in a first review: future spend, corpus, what you have, and the gap."
      notes={[
        "Today's monthly spend is grown at your inflation rate until retirement.",
        "The corpus funds that spend, rising with inflation every year, until the age you plan for. We treat it as a growing annuity earning the post-retirement return.",
        "Existing savings grow at their own return. The monthly SIP is a level amount that closes the remaining gap at the SIP return.",
        "Taxes, one-off goals and pension income are not included. A review adds them.",
      ]}
    >
      <RetirementCalculator />
    </CalcPage>
  );
}
