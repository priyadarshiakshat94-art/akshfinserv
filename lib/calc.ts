// Pure finance maths for the calculators. Rates are annual percentages (12 = 12%).

/** Future value of a monthly SIP, paid at the start of each month, with an optional yearly step-up. */
export function sipFutureValue(monthly: number, years: number, ratePct: number, stepUpPct = 0) {
  const r = ratePct / 100 / 12;
  let value = 0;
  let invested = 0;
  for (let m = 0; m < Math.round(years * 12); m++) {
    const amt = monthly * Math.pow(1 + stepUpPct / 100, Math.floor(m / 12));
    invested += amt;
    value = (value + amt) * (1 + r);
  }
  return { value, invested, gains: value - invested };
}

/** Level monthly SIP needed to reach `target` in `years`. */
export function sipForTarget(target: number, years: number, ratePct: number) {
  const r = ratePct / 100 / 12;
  const n = Math.round(years * 12);
  if (n <= 0 || target <= 0) return 0;
  if (r === 0) return target / n;
  return target / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
}

export type RetirementInput = {
  age: number;
  retireAge: number;
  lifeExpectancy: number;
  monthlyExpense: number; // today's rupees
  inflationPct: number;
  preReturnPct: number; // on existing savings until retirement
  sipReturnPct: number; // on new SIPs until retirement
  postReturnPct: number; // on the corpus after retirement
  savings: number; // existing retirement savings today
};

/**
 * Corpus needed at retirement to fund inflation-rising expenses until life expectancy
 * (growing annuity, withdrawals at the end of each year), then the gap after growing
 * existing savings and the level monthly SIP that closes it.
 */
export function retirementPlan(i: RetirementInput) {
  const yearsToRetire = Math.max(0, i.retireAge - i.age);
  const yearsInRetirement = Math.max(1, i.lifeExpectancy - i.retireAge);
  const g = i.inflationPct / 100;
  const r = i.postReturnPct / 100;

  const monthlyAtRetirement = i.monthlyExpense * Math.pow(1 + g, yearsToRetire);
  const firstYear = monthlyAtRetirement * 12;

  // Present value at retirement of a growing annuity: firstYear * (1 - q^n) / (r - g).
  const q = (1 + g) / (1 + r);
  const factor =
    Math.abs(r - g) < 1e-9 ? yearsInRetirement / (1 + r) : (1 - Math.pow(q, yearsInRetirement)) / (r - g);
  const corpusNeeded = firstYear * factor;

  const savingsAtRetirement = i.savings * Math.pow(1 + i.preReturnPct / 100, yearsToRetire);
  const gap = Math.max(0, corpusNeeded - savingsAtRetirement);
  const monthlySip = sipForTarget(gap, yearsToRetire, i.sipReturnPct);

  return { yearsToRetire, yearsInRetirement, monthlyAtRetirement, corpusNeeded, savingsAtRetirement, gap, monthlySip };
}

export type LoanVsLiquidateInput = {
  amount: number; // cash needed
  months: number; // until it can be repaid
  loanRatePct: number;
  processingFee: number; // flat rupees
  expectedReturnPct: number; // on the portfolio
  gainSharePct: number; // share of the redeemed amount that is gain
  longTerm: boolean; // units held over 12 months (equity)
  exitLoadPct: number;
  otherLtcgThisYear: number; // gains already booked this year, used against the exemption
};

// Equity mutual fund tax as of FY 2025-26: LTCG 12.5% above ₹1.25 lakh a year, STCG 20%.
export const LTCG_RATE = 0.125;
export const STCG_RATE = 0.2;
export const LTCG_EXEMPTION = 125000;

export function loanVsLiquidate(i: LoanVsLiquidateInput) {
  const years = i.months / 12;

  const interest = i.amount * (i.loanRatePct / 100) * years; // simple interest on a bullet/overdraft loan
  const loanCost = interest + i.processingFee;

  // Redeem slightly more to cover exit load and tax, so the cash in hand still equals `amount`.
  const gainShare = i.gainSharePct / 100;
  const load = i.exitLoadPct / 100;
  const taxOn = (gain: number) => {
    if (!i.longTerm) return gain * STCG_RATE;
    const exemptLeft = Math.max(0, LTCG_EXEMPTION - i.otherLtcgThisYear);
    return Math.max(0, gain - exemptLeft) * LTCG_RATE;
  };
  let redeem = i.amount;
  for (let k = 0; k < 20; k++) {
    const net = redeem * (1 - load) - taxOn(redeem * gainShare);
    redeem += i.amount - net;
  }
  const exitLoad = redeem * load;
  const tax = taxOn(redeem * gainShare);
  const lostGrowth = redeem * (Math.pow(1 + i.expectedReturnPct / 100, years) - 1);
  const liquidateCost = exitLoad + tax + lostGrowth;

  return {
    loan: { interest, processingFee: i.processingFee, total: loanCost },
    liquidate: { redeem, exitLoad, tax, lostGrowth, total: liquidateCost },
    cheaper: loanCost <= liquidateCost ? ("loan" as const) : ("liquidate" as const),
    difference: Math.abs(liquidateCost - loanCost),
  };
}
