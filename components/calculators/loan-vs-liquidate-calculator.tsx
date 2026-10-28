"use client";

import { useState } from "react";
import { LTCG_EXEMPTION, loanVsLiquidate } from "@/lib/calc";
import { fmtINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CalcLayout, SliderField, Toggle } from "./ui";

function Side({ wins, title, rows, total }: { wins: boolean; title: string; rows: [string, number][]; total: number }) {
  return (
    <div
      className={cn(
        "rounded-card p-7 sm:p-8",
        wins ? "bg-gold text-ink-dark" : "border border-line bg-elevated text-ink",
      )}
    >
      <div className="flex items-center justify-between">
        <p className={cn("text-sm", wins ? "text-[#3d2f1a]" : "text-ink-secondary")}>{title}</p>
        {wins ? <span className="rounded-pill bg-ink-dark px-3 py-1 text-xs text-surface-light">Cheaper</span> : null}
      </div>
      <p className="display-num mt-8 text-[clamp(2.5rem,5vw,3.75rem)]">{fmtINR(total)}</p>
      <dl className="mt-6 space-y-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className={wins ? "text-[#3d2f1a]" : "text-ink-secondary"}>{k}</dt>
            <dd className="tabular-nums">{fmtINR(v)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function LoanVsLiquidateCalculator() {
  const [amount, setAmount] = useState(600000);
  const [months, setMonths] = useState(9);
  const [loanRatePct, setLoanRate] = useState(10.5);
  const [processingFee, setFee] = useState(0);
  const [expectedReturnPct, setReturn] = useState(12);
  const [gainSharePct, setGainShare] = useState(33);
  const [longTerm, setLongTerm] = useState(true);
  const [exitLoadPct, setExitLoad] = useState(0);
  const [otherLtcgThisYear, setOtherLtcg] = useState(0);

  const r = loanVsLiquidate({
    amount,
    months,
    loanRatePct,
    processingFee,
    expectedReturnPct,
    gainSharePct,
    longTerm,
    exitLoadPct,
    otherLtcgThisYear,
  });

  return (
    <CalcLayout
      inputs={
        <>
          <SliderField
            label="Cash you need"
            prefix="₹"
            value={amount}
            onChange={setAmount}
            min={50000}
            max={10000000}
            step={10000}
          />
          <SliderField
            label="Months until you can repay"
            value={months}
            onChange={setMonths}
            min={1}
            max={36}
            suffix="mo"
          />
          <SliderField
            label="Loan interest rate"
            value={loanRatePct}
            onChange={setLoanRate}
            min={7}
            max={16}
            step={0.25}
            suffix="%"
          />
          <SliderField
            label="Processing fee"
            prefix="₹"
            value={processingFee}
            onChange={setFee}
            min={0}
            max={25000}
            step={500}
          />
          <SliderField
            label="Expected return if invested"
            value={expectedReturnPct}
            onChange={setReturn}
            min={0}
            max={18}
            step={0.5}
            suffix="%"
            hint="What the redeemed money would have earned had it stayed in."
          />
          <SliderField
            label="Share of the amount that is gain"
            value={gainSharePct}
            onChange={setGainShare}
            min={0}
            max={90}
            suffix="%"
            hint="Check your capital gains statement. 33% means ₹1 of every ₹3 is profit."
          />
          <Toggle
            label="Units held over 12 months"
            checked={longTerm}
            onChange={setLongTerm}
            hint={
              longTerm ? `Equity LTCG: 12.5% above ${fmtINR(LTCG_EXEMPTION)} a year.` : "Equity STCG: 20% on the gain."
            }
          />
          {longTerm ? (
            <SliderField
              label="Long-term gains already booked this year"
              prefix="₹"
              value={otherLtcgThisYear}
              onChange={setOtherLtcg}
              min={0}
              max={500000}
              step={5000}
              hint="These use up the yearly exemption first."
            />
          ) : null}
          <SliderField
            label="Exit load"
            value={exitLoadPct}
            onChange={setExitLoad}
            min={0}
            max={2}
            step={0.25}
            suffix="%"
          />
        </>
      }
      result={
        <>
          <div className="rounded-card border border-line bg-elevated p-7 sm:p-8" aria-live="polite">
            <p className="text-sm text-ink-secondary">Verdict</p>
            <p className="mt-3 font-display text-[clamp(1.6rem,3vw,2.25rem)] leading-tight text-ink">
              {r.cheaper === "loan" ? "Borrowing" : "Redeeming"} costs {fmtINR(r.difference)} less over {months} months.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Side
              wins={r.cheaper === "loan"}
              title="Loan against funds"
              total={r.loan.total}
              rows={[
                ["Interest", r.loan.interest],
                ["Processing fee", r.loan.processingFee],
              ]}
            />
            <Side
              wins={r.cheaper === "liquidate"}
              title="Redeem units"
              total={r.liquidate.total}
              rows={[
                ["Tax", r.liquidate.tax],
                ["Exit load", r.liquidate.exitLoad],
                ["Lost growth", r.liquidate.lostGrowth],
              ]}
            />
          </div>
          <p className="px-2 text-xs text-ink-muted">
            Redeeming assumes you sell {fmtINR(r.liquidate.redeem)} so that {fmtINR(amount)} reaches your account after
            tax and exit load. Loan interest is simple interest on the full amount for the whole period.
          </p>
        </>
      }
    />
  );
}
