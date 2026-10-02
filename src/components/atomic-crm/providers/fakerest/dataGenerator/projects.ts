import { company, datatype, lorem, random } from "faker/locale/en_US";

import { defaultCompanySectors } from "../../../root/defaultConfiguration";
import type { Project } from "../../../types";
import type { Db } from "./types";
import { randomDate } from "./utils";

// Fake seed data only: no real customer or project names.
const places = [
  "New Capital",
  "New Cairo",
  "6th of October",
  "Sheikh Zayed",
  "Alexandria",
  "Ain Sokhna",
  "Mansoura",
  "Assiut",
  "Hurghada",
  "Port Said",
];

const kinds = [
  "Hospital",
  "Data Center",
  "Residential Compound",
  "Mall",
  "Factory",
  "Hotel",
  "Water Treatment Plant",
  "University Campus",
];

export const generateProjects = (db: Db, size = 20): Project[] =>
  Array.from(Array(size).keys()).map((id) => {
    const location = random.arrayElement(places);
    return {
      id,
      name: `${location} ${random.arrayElement(kinds)} ${id + 1}`,
      end_client: company.companyName(),
      consultant: `${company.companyName()} Consultants`,
      location,
      sector: random.arrayElement(defaultCompanySectors).value,
      estimated_value: datatype.number({ min: 5, max: 500 }) * 1_000_000,
      description: lorem.sentence(),
      sales_id: random.arrayElement(db.sales).id,
      created_at: randomDate().toISOString(),
    };
  });
