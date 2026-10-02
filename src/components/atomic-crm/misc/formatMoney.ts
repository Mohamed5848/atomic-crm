/** Compact money display used on cards and reports, e.g. "EGP 1.25M". */
export const formatCompactMoney = (
  amount: number | null | undefined,
  currency: string,
): string =>
  (amount ?? 0).toLocaleString("en-US", {
    notation: "compact",
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumSignificantDigits: 3,
  });
