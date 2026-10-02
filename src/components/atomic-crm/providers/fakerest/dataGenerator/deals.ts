import { add } from "date-fns";
import { datatype, lorem, random } from "faker/locale/en_US";

import { getLineItemsTotal } from "../../../deals/opportunity";
import {
  defaultAlternatorBrands,
  defaultDealCategories,
  defaultDealStages,
  defaultEngineBrands,
  defaultInHandDealStages,
} from "../../../root/defaultConfiguration";
import type { Deal, DealLineItem, DealRevision } from "../../../types";
import { CANOPY_TYPES } from "../../../types";
import type { Db } from "./types";
import { randomDate } from "./utils";

const KVA_RATINGS = [20, 50, 100, 250, 500, 800, 1000, 1500, 2000, 2500, 3000];

/** Rough fake price per kVA, in EGP */
const PRICE_PER_KVA = 9_000;

const generateLineItems = (): DealLineItem[] => {
  const kva = random.arrayElement(KVA_RATINGS);
  const quantity = datatype.number({ min: 1, max: 4 });
  const items: DealLineItem[] = [
    {
      item_type: "genset",
      description: `${kva} kVA diesel generator set`,
      quantity,
      unit_price: kva * PRICE_PER_KVA,
      kva,
      rating_type: random.arrayElement(["prime", "standby"]),
      engine_brand: random.arrayElement(defaultEngineBrands).value,
      alternator_brand: random.arrayElement(defaultAlternatorBrands).value,
      canopy_type: random.arrayElement(CANOPY_TYPES),
      voltage: "400/230 V",
      frequency: "50",
    },
  ];
  if (datatype.boolean()) {
    items.push({
      item_type: "ats_panel",
      description: `ATS panel ${kva} kVA`,
      quantity,
      unit_price: Math.round(kva * PRICE_PER_KVA * 0.08),
    });
  }
  if (datatype.boolean()) {
    items.push({
      item_type: "fuel_tank",
      description: "External fuel tank 2,000 L",
      quantity: 1,
      unit_price: 85_000,
    });
  }
  return items;
};

/** Rev 0 is above the final price, each revision gives a little discount. */
const generateRevisions = (finalValue: number, createdAt: string) => {
  const count = datatype.number({ min: 1, max: 3 });
  return Array.from(Array(count).keys()).map(
    (revision): DealRevision => ({
      revision,
      date: add(new Date(createdAt), { weeks: revision * 2 })
        .toISOString()
        .split("T")[0],
      value: Math.round(finalValue * (1 + (count - 1 - revision) * 0.05)),
      notes: revision === 0 ? "Initial offer" : "Revised after clarification",
    }),
  );
};

export const generateDeals = (db: Db): Deal[] => {
  const deals = Array.from(Array(50).keys()).map((id): Deal => {
    const company = random.arrayElement(db.companies);
    company.nb_deals = (company.nb_deals ?? 0) + 1;
    const contacts = random.arrayElements(
      db.contacts.filter((contact) => contact.company_id === company.id),
      datatype.number({ min: 1, max: 3 }),
    );
    // most opportunities pursue a project, often several contractors per project
    const project =
      datatype.number(9) < 8 ? random.arrayElement(db.projects) : undefined;
    const pipeline = datatype.number(9) < 6 ? "tender" : "in_hand";
    const stages =
      pipeline === "tender" ? defaultDealStages : defaultInHandDealStages;
    const created_at = randomDate(new Date(company.created_at)).toISOString();
    const expected_closing_date = randomDate(
      new Date(created_at),
      add(new Date(created_at), { months: 6 }),
    )
      .toISOString()
      .split("T")[0];
    const line_items = generateLineItems();
    const amount = getLineItemsTotal(line_items);
    const lowercaseName = lorem.words(2);

    return {
      id,
      name: project
        ? `${project.name} - ${company.name}`
        : lowercaseName[0].toUpperCase() + lowercaseName.slice(1),
      company_id: company.id,
      project_id: project?.id ?? null,
      pipeline,
      cr_number: `CR-2026-${String(id + 1).padStart(4, "0")}`,
      line_items,
      revisions: generateRevisions(amount, created_at),
      contact_ids: contacts.map((contact) => contact.id),
      category: random.arrayElement(defaultDealCategories).value,
      stage: random.arrayElement(stages).value,
      description: lorem.paragraph(),
      amount,
      created_at,
      updated_at: randomDate(new Date(created_at)).toISOString(),
      expected_closing_date,
      sales_id: company.sales_id!,
      index: 0,
    };
  });
  // compute index based on pipeline and stage
  [...defaultDealStages, ...defaultInHandDealStages].forEach((stage) => {
    deals
      .filter((deal) => deal.stage === stage.value)
      .forEach((deal, index) => {
        deals[deal.id as number].index = index;
      });
  });
  return deals;
};
