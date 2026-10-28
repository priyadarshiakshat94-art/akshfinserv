import type { Metadata } from "next";
import { CalcPage } from "@/components/calculators/calc-page";
import { SipCalculator } from "@/components/calculators/sip-calculator";

export const metadata: Metadata = {
  title: "SIP calculator",
  description: "See what a monthly SIP could grow to, with an optional yearly step-up. Same maths we use in client reviews.",
  alternates: { canonical: "/calculators/sip" },
};

export default function SipPage() {
  return (
    <CalcPage
      current="/calculators/sip"
      title="What does a monthly SIP become?"
      lede="Move the sliders. The step-up line is the one most people underestimate."
      notes={[
        "Each instalment is invested at the start of the month and compounds monthly at the expected annual return divided by 12.",
        "The step-up raises the SIP once a year by the percentage you choose.",
        "Figures are before tax and do not adjust for inflation.",
      ]}
    >
      <SipCalculator />
    </CalcPage>
  );
}
