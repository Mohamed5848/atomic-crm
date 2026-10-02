/**
 * Pure helpers behind the import preview: map the columns of the user's CSV
 * to the CRM fields, and flag rows that would create duplicates.
 */

export type RawRow = Record<string, string>;

/** CRM field -> CSV column ("" = not imported) */
export type ColumnMapping = Record<string, string>;

export type RowStatus =
  | "new"
  | "duplicate_existing"
  | "duplicate_file"
  | "invalid";

export type DuplicateResource = "companies" | "contacts";

/** Headers commonly found in exported customer lists, per CRM field. */
const FIELD_ALIASES: Record<string, string[]> = {
  name: [
    "company",
    "company name",
    "customer",
    "customer name",
    "account",
    "client",
  ],
  phone_number: ["phone", "telephone", "tel", "mobile"],
  website: ["web", "url", "site"],
  sector: ["industry", "activity"],
  city: ["town", "governorate"],
  description: ["notes", "comment", "comments"],
  first_name: ["first", "firstname", "given name"],
  last_name: ["last", "lastname", "surname", "family name"],
  title: ["job title", "position", "role"],
  company: ["company", "company name", "customer", "account", "organization"],
  email_work: ["email", "e mail", "mail", "work email"],
  phone_work: ["phone", "mobile", "telephone", "tel", "work phone"],
};

/** Lowercase, strip punctuation and unify common Arabic letter variants. */
export const normalizeText = (value: unknown): string =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

/** Proposes a CSV column for each CRM field, by exact name then by alias. */
export const autoMapColumns = (
  sourceHeaders: string[],
  targetFields: string[],
): ColumnMapping => {
  const bySimplified = new Map(
    sourceHeaders.map((header) => [normalizeText(header), header]),
  );
  const used = new Set<string>();
  const mapping: ColumnMapping = {};
  for (const field of targetFields) {
    const candidates = [
      field,
      field.replace(/_/g, " "),
      ...(FIELD_ALIASES[field] ?? []),
    ];
    const match = candidates
      .map((candidate) => bySimplified.get(normalizeText(candidate)))
      .find((header) => header !== undefined && !used.has(header));
    mapping[field] = match ?? "";
    if (match) used.add(match);
  }
  return mapping;
};

/** Rows keyed by CRM field, unmapped fields left empty. */
export const applyMapping = (
  rows: RawRow[],
  mapping: ColumnMapping,
): RawRow[] =>
  rows.map((row) =>
    Object.fromEntries(
      Object.entries(mapping).map(([field, column]) => [
        field,
        column ? String(row[column] ?? "").trim() : "",
      ]),
    ),
  );

type ExistingCompany = { name?: string | null };
type ExistingContact = {
  first_name?: string | null;
  last_name?: string | null;
  company_name?: string | null;
  email_jsonb?: { email: string }[] | null;
};

const contactNameKey = (
  firstName: unknown,
  lastName: unknown,
  company: unknown,
) => {
  const name = normalizeText(`${firstName ?? ""} ${lastName ?? ""}`);
  return name ? `${name}|${normalizeText(company)}` : "";
};

const rowEmails = (row: RawRow) =>
  [row.email_work, row.email_home, row.email_other]
    .map((email) => (email ?? "").trim().toLowerCase())
    .filter(Boolean);

/**
 * Status of each mapped row. Companies match on their normalized name;
 * contacts match on any email, or on first + last name within the same company.
 */
export const detectDuplicates = (
  resource: DuplicateResource,
  rows: RawRow[],
  existing: ExistingCompany[] | ExistingContact[],
): RowStatus[] => {
  if (resource === "companies") {
    const known = new Set(
      (existing as ExistingCompany[]).map((company) =>
        normalizeText(company.name),
      ),
    );
    const seen = new Set<string>();
    return rows.map((row) => {
      const key = normalizeText(row.name);
      if (!key) return "invalid";
      if (known.has(key)) return "duplicate_existing";
      if (seen.has(key)) return "duplicate_file";
      seen.add(key);
      return "new";
    });
  }

  const knownEmails = new Set<string>();
  const knownNames = new Set<string>();
  for (const contact of existing as ExistingContact[]) {
    (contact.email_jsonb ?? []).forEach(({ email }) =>
      knownEmails.add(email.trim().toLowerCase()),
    );
    const key = contactNameKey(
      contact.first_name,
      contact.last_name,
      contact.company_name,
    );
    if (key) knownNames.add(key);
  }
  const seenEmails = new Set<string>();
  const seenNames = new Set<string>();
  return rows.map((row) => {
    const nameKey = contactNameKey(row.first_name, row.last_name, row.company);
    const emails = rowEmails(row);
    if (!nameKey) return "invalid";
    if (
      knownNames.has(nameKey) ||
      emails.some((email) => knownEmails.has(email))
    ) {
      return "duplicate_existing";
    }
    if (
      seenNames.has(nameKey) ||
      emails.some((email) => seenEmails.has(email))
    ) {
      return "duplicate_file";
    }
    seenNames.add(nameKey);
    emails.forEach((email) => seenEmails.add(email));
    return "new";
  });
};
