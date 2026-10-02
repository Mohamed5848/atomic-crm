import { describe, expect, it } from "vitest";

import {
  applyMapping,
  autoMapColumns,
  detectDuplicates,
  normalizeText,
} from "./importMapping";

describe("autoMapColumns", () => {
  it("maps columns by exact name, then by common aliases, case-insensitively", () => {
    const mapping = autoMapColumns(
      ["Customer Name", "Phone", "City", "Unrelated"],
      ["name", "phone_number", "city", "website"],
    );

    expect(mapping).toEqual({
      name: "Customer Name",
      phone_number: "Phone",
      city: "City",
      website: "",
    });
  });

  it("never maps the same column to two fields", () => {
    const mapping = autoMapColumns(["Phone"], ["phone_work", "phone_home"]);

    expect(mapping).toEqual({ phone_work: "Phone", phone_home: "" });
  });
});

describe("applyMapping", () => {
  it("renames columns to CRM fields and trims values", () => {
    const rows = applyMapping([{ "Customer Name": "  Acme  ", Phone: "123" }], {
      name: "Customer Name",
      phone_number: "Phone",
      city: "",
    });

    expect(rows).toEqual([{ name: "Acme", phone_number: "123", city: "" }]);
  });
});

describe("normalizeText", () => {
  it("ignores case, punctuation and Arabic letter variants", () => {
    expect(normalizeText("El-Sewedy  Co.")).toBe(normalizeText("el sewedy co"));
    expect(normalizeText("شركة أحمد")).toBe(normalizeText("شركه احمد"));
  });
});

describe("detectDuplicates", () => {
  it("flags companies already in the CRM, repeated in the file, or without a name", () => {
    const statuses = detectDuplicates(
      "companies",
      [
        { name: "Acme Contracting" },
        { name: "ACME contracting." },
        { name: "Globex" },
        { name: "New Co" },
        { name: "new co" },
        { name: "" },
      ],
      [{ name: "Globex" }],
    );

    expect(statuses).toEqual([
      "new",
      "duplicate_file",
      "duplicate_existing",
      "new",
      "duplicate_file",
      "invalid",
    ]);
  });

  it("flags contacts matching an existing email or the same name in the same company", () => {
    const statuses = detectDuplicates(
      "contacts",
      [
        {
          first_name: "Sara",
          last_name: "Adel",
          company: "Acme",
          email_work: "SARA@acme.example",
        },
        {
          first_name: "Omar",
          last_name: "Nabil",
          company: "Globex",
          email_work: "",
        },
        {
          first_name: "Omar",
          last_name: "Nabil",
          company: "Initech",
          email_work: "",
        },
        {
          first_name: "Mona",
          last_name: "Ali",
          company: "Acme",
          email_work: "mona@acme.example",
        },
        {
          first_name: "M.",
          last_name: "Ali",
          company: "Other",
          email_work: "mona@acme.example",
        },
        {
          first_name: "",
          last_name: "",
          company: "Acme",
          email_work: "x@acme.example",
        },
      ],
      [
        {
          first_name: "S",
          last_name: "A",
          company_name: "X",
          email_jsonb: [{ email: "sara@acme.example" }],
        },
        {
          first_name: "Omar",
          last_name: "Nabil",
          company_name: "Globex",
          email_jsonb: [],
        },
      ],
    );

    expect(statuses).toEqual([
      "duplicate_existing",
      "duplicate_existing",
      "new",
      "new",
      "duplicate_file",
      "invalid",
    ]);
  });
});
