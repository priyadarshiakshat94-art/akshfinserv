"use client";

import { useState } from "react";
import { sipFutureValue } from "@/lib/calc";
import { fmtINR } from "@/lib/format";
import { BigResult, Breakdown, CalcLayout, SliderField, splitUnit } from "./ui";

export function SipCalculator() {
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);
  const [stepUp, setStepUp] = useState(0);

  const r = sipFutureValue(monthly, years, rate, stepUp);
  const big = splitUnit(fmtINR(r.value));
  const multiple = r.invested > 0 ? r.value / r.invested : 0;

  return (
    <CalcLayout
      inputs={
        <>
          <SliderField
            label="Monthly SIP"
            prefix="₹"
            value={monthly}
            onChange={setMonthly}
            min={500}
            max={500000}
            step={500}
          />
          <SliderField label="Years" value={years} onChange={setYears} min={1} max={40} suffix="yrs" />
          <SliderField
            label="Expected return"
            value={rate}
            onChange={setRate}
            min={4}
            max={18}
            step={0.5}
            suffix="%"
            hint="We use 10 to 12% for diversified equity over 10+ years. Not a promise."
          />
          <SliderField
            label="Yearly step-up"
            value={stepUp}
            onChange={setStepUp}
            min={0}
            max={25}
            suffix="%"
            hint="Raise the SIP each year with your increment. Even 5% changes the answer a lot."
          />
        </>
      }
      result={
        <>
          <BigResult
            label={`In ${years} years, your SIP could be worth`}
            value={big.value}
            unit={big.unit}
            sub={<>That is {multiple.toFixed(1)}x what you put in.</>}
          />
          <Breakdown
            rows={[
              { label: "You invest", value: fmtINR(r.invested) },
              { label: "Estimated gains", value: fmtINR(r.gains) },
              { label: "Estimated value", value: fmtINR(r.value), strong: true },
            ]}
          />
        </>
      }
    />
  );
}
