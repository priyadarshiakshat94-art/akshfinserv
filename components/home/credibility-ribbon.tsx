import { Fragment } from "react";

const ITEMS = [
  "AMFI Registered",
  "NSE",
  "MDRT Top of the Table",
  "AWMIE Top 100 Women in Finance",
  "Kotak Life Living Legend",
];

export function CredibilityRibbon() {
  return (
    <div className="border-y border-line">
      <ul
        aria-label="Registrations and recognition"
        className="mx-auto flex w-full max-w-[1320px] flex-wrap items-center justify-center gap-x-5 gap-y-3 px-5 py-7 sm:px-8 lg:justify-between"
      >
        {ITEMS.map((item, i) => (
          <Fragment key={item}>
            {i > 0 ? (
              <li aria-hidden className="size-1 rounded-full bg-ink-muted/60" />
            ) : null}
            <li className="eyebrow whitespace-nowrap text-ink-secondary">{item}</li>
          </Fragment>
        ))}
      </ul>
    </div>
  );
}
