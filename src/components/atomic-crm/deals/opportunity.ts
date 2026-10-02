import type { DealLineItem, DealRevision } from "../types";

const CR_NUMBER_REGEX = /^CR-(\d{4})-(\d+)$/;

/**
 * Next CR number in the database format (CR-<year>-<0001>), continuing the
 * highest sequence already used. Mirrors the `deals.cr_number` column default
 * for the FakeRest provider.
 */
export const nextCrNumber = (
  existing: (string | null | undefined)[],
  now: Date = new Date(),
): string => {
  const highest = existing.reduce((max, crNumber) => {
    const match = crNumber?.match(CR_NUMBER_REGEX);
    return match ? Math.max(max, Number(match[2])) : max;
  }, 0);
  return `CR-${now.getFullYear()}-${String(highest + 1).padStart(4, "0")}`;
};

export const formatRevision = (revision: number): string => `Rev ${revision}`;

export const getLatestRevision = (
  revisions: DealRevision[] | null | undefined,
): DealRevision | undefined =>
  (revisions ?? []).reduce<DealRevision | undefined>(
    (latest, revision) =>
      !latest || revision.revision > latest.revision ? revision : latest,
    undefined,
  );

/** Appends Rev N+1 (Rev 0 for the first one) without touching earlier revisions. */
export const addRevision = (
  revisions: DealRevision[] | null | undefined,
  revision: Omit<DealRevision, "revision">,
): DealRevision[] => {
  const latest = getLatestRevision(revisions);
  return [
    ...(revisions ?? []),
    { ...revision, revision: latest ? latest.revision + 1 : 0 },
  ];
};

export const getLineItemsTotal = (
  lineItems: DealLineItem[] | null | undefined,
): number =>
  (lineItems ?? []).reduce(
    (total, item) =>
      total + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0),
    0,
  );

/** Total generating capacity quoted, in kVA (gensets only). */
export const getTotalKva = (
  lineItems: DealLineItem[] | null | undefined,
): number =>
  (lineItems ?? [])
    .filter((item) => item.item_type === "genset")
    .reduce(
      (total, item) =>
        total + (Number(item.quantity) || 0) * (Number(item.kva) || 0),
      0,
    );
