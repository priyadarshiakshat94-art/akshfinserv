"use client";

import { useState } from "react";
import { retirementPlan } from "@/lib/calc";
import { fmtINR } from "@/lib/format";
import { BigResult, Breakdown, CalcLayout, SliderField, splitUnit } from "./ui";

export function RetirementCalculator() {
  const [age, setAge] = useState(45);
  const [retireAge, setRetireAge] = useState(60);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [monthlyExpense, setMonthlyExpense] = useState(120000);
  const [inflationPct, setInflation] = useState(6);
  const [savings, setSavings] = useState(11000000);
  const [preReturnPct, setPre] = useState(10);
  const [sipReturnPct, setSip] = useState(11);
  const [postReturnPct, setPost] = useState(7);

  const p = retirementPlan({
    age,
    retireAge: Math.max(retireAge, age),
    lifeExpectancy: Math.max(lifeExpectancy, retireAge + 1),
    monthlyExpense,
    inflationPct,
    savings,
    preReturnPct,
    sipReturnPct,
    postReturnPct,
  });
  const sip = splitUnit(fmtINR(p.monthlySip));
  const surplus = splitUnit(fmtINR(p.savingsAtRetirement - p.corpusNeeded));

  return (
    <CalcLayout
      inputs={
        <>
          <SliderField label="Your age today" value={age} onChange={setAge} min={20} max={70} suffix="yrs" />
          <SliderField label="Retire at" value={retireAge} onChange={setRetireAge} min={40} max={75} suffix="yrs" />
          <SliderField
            label="Plan until age"
            value={lifeExpectancy}
            onChange={setLifeExpectancy}
            min={70}
            max={100}
            suffix="yrs"
            hint="We plan to 85 at minimum. Longer is safer."
          />
          <SliderField
            label="Monthly spend today"
            prefix="₹"
            value={monthlyExpense}
            onChange={setMonthlyExpense}
            min={10000}
            max={1000000}
            step={5000}
            hint="Household spending, excluding EMIs and school fees that end before retirement."
          />
          <SliderField
            label="Inflation"
            value={inflationPct}
            onChange={setInflation}
            min={3}
            max={10}
            step={0.5}
            suffix="%"
          />
          <SliderField
            label="Retirement savings today"
            prefix="₹"
            value={savings}
            onChange={setSavings}
            min={0}
            max={100000000}
            step={100000}
            hint="EPF, PPF, NPS and mutual funds set aside for retirement."
          />
          <SliderField
            label="Return on existing savings"
            value={preReturnPct}
            onChange={setPre}
            min={4}
            max={15}
            step={0.5}
            suffix="%"
          />
          <SliderField
            label="Return on new SIPs"
            value={sipReturnPct}
            onChange={setSip}
            min={4}
            max={15}
            step={0.5}
            suffix="%"
          />
          <SliderField
            label="Return after retirement"
            value={postReturnPct}
            onChange={setPost}
            min={4}
            max={12}
            step={0.5}
            suffix="%"
            hint="Mostly debt and hybrid funds, so lower than before."
          />
        </>
      }
      result={
        p.gap <= 0 ? (
          <>
            <BigResult
              label="You are on track"
              value={surplus.value}
              unit={`${surplus.unit ?? ""} surplus`}
              sub="Your current savings should cover the corpus. A review can check the assumptions."
            />
            <Breakdown
              rows={[
                { label: "Corpus needed at retirement", value: fmtINR(p.corpusNeeded) },
                { label: "Savings grown to retirement", value: fmtINR(p.savingsAtRetirement), strong: true },
              ]}
            />
          </>
        ) : (
          <>
            <BigResult
              label={`Monthly SIP needed for ${p.yearsToRetire} years`}
              value={sip.value}
              unit={sip.unit ?? "a month"}
              sub={
                <>
                  To close a gap of {fmtINR(p.gap)} by age {retireAge}.
                </>
              }
            />
            <Breakdown
              rows={[
                { label: `Monthly spend at ${retireAge}`, value: fmtINR(p.monthlyAtRetirement) },
                { label: `Corpus needed for ${p.yearsInRetirement} years`, value: fmtINR(p.corpusNeeded) },
                { label: "Existing savings, grown", value: fmtINR(p.savingsAtRetirement) },
                { label: "Gap to close", value: fmtINR(p.gap), strong: true },
              ]}
            />
          </>
        )
      }
    />
  );
}
