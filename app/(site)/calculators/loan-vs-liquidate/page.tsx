import type { Metadata } from "next";
import { CalcPage } from "@/components/calculators/calc-page";
import { LoanVsLiquidateCalculator } from "@/components/calculators/loan-vs-liquidate-calculator";

export const metadata: Metadata = {
  title: "Loan vs liquidate calculator",
  description: "Compare borrowing against your mutual funds with redeeming them: interest against tax, exit load and lost growth.",
  alternates: { canonical: "/calculators/loan-vs-liquidate" },
};

export default function LoanVsLiquidatePage() {
  return (
    <CalcPage
      current="/calculators/loan-vs-liquidate"
      title="Borrow against your funds, or redeem them?"
      lede="Put in the amount and how long you need it. We compare what each option really costs."
      notes={[
        "Loan cost is simple interest on the full amount for the whole period, plus any processing fee.",
        "Redemption cost is tax, exit load and the growth the redeemed money would have earned over the same period.",
        "Tax uses equity mutual fund rates for FY 2025-26: 12.5% on long-term gains above ₹1.25 lakh a year, 20% on short-term gains. Debt fund gains are taxed at your slab and are not modelled here.",
        "A loan only makes sense if repayment is certain. If markets fall, the lender can ask for more security.",
      ]}
    >
      <LoanVsLiquidateCalculator />
    </CalcPage>
  );
}
