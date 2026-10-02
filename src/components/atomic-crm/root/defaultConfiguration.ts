import type { ConfigurationContextValue } from "./ConfigurationContext";
// Import the logos as module assets so Vite resolves their URL relative to the
// JS chunk (import.meta.url), not the current route. A plain "./logos/..." path
// breaks on nested routes like /oauth/consent and under a deployment sub-path.
import darkModeLogo from "./logos/logo_atomic_crm_dark.svg";
import lightModeLogo from "./logos/logo_atomic_crm_light.svg";

export const defaultDarkModeLogo = darkModeLogo;
export const defaultLightModeLogo = lightModeLogo;

export const defaultCurrency = "EGP";

export const defaultTitle = "AMI CRM";

export const defaultCompanySectors = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial / Malls" },
  { value: "healthcare", label: "Hospitals / Healthcare" },
  { value: "industrial", label: "Industrial / Factories" },
  { value: "data-centers-telecom", label: "Data Centers / Telecom" },
  { value: "oil-gas", label: "Oil & Gas" },
  { value: "utilities", label: "Utilities / Power" },
  { value: "government", label: "Government / Infrastructure" },
  { value: "hospitality", label: "Hotels / Tourism" },
  { value: "agriculture", label: "Agriculture" },
];

/** Stages of the Tender pipeline */
export const defaultDealStages = [
  { value: "tender-announced", label: "Tender Announced" },
  { value: "quotation-submitted", label: "Quotation Submitted" },
  { value: "technical-evaluation", label: "Technical Evaluation" },
  { value: "commercial-evaluation", label: "Commercial Evaluation" },
  { value: "awarded", label: "Awarded to Contractor" },
  { value: "tender-lost", label: "Lost" },
  { value: "tender-on-hold", label: "On Hold" },
];

/** Stages of the In Hand pipeline (after the contractor won the tender) */
export const defaultInHandDealStages = [
  { value: "negotiation", label: "Negotiation" },
  { value: "po-received", label: "PO Received" },
  { value: "production", label: "Production" },
  { value: "delivered", label: "Delivered" },
  { value: "commissioned", label: "Commissioned" },
  { value: "in-hand-lost", label: "Lost" },
];

export const defaultDealPipelineStatuses = ["commissioned", "in-hand-lost"];

export const defaultEngineBrands = [
  { value: "perkins", label: "Perkins" },
  { value: "cummins", label: "Cummins" },
  { value: "mtu", label: "MTU" },
  { value: "volvo", label: "Volvo" },
  { value: "hyundai", label: "Hyundai" },
  { value: "deutz", label: "Deutz" },
  { value: "mitsubishi", label: "Mitsubishi" },
];

export const defaultAlternatorBrands = [
  { value: "stamford", label: "Stamford" },
  { value: "leroy-somer", label: "Leroy Somer" },
  { value: "mecc-alte", label: "Mecc Alte" },
];

export const defaultDealCategories = [
  { value: "contractor", label: "Through Contractor" },
  { value: "direct", label: "Direct to End Client" },
  { value: "distributor", label: "Distributor / Reseller" },
];

export const defaultNoteStatuses = [
  { value: "cold", label: "Cold", color: "#7dbde8" },
  { value: "warm", label: "Warm", color: "#e8cb7d" },
  { value: "hot", label: "Hot", color: "#e88b7d" },
  { value: "in-contract", label: "In Contract", color: "#a4e87d" },
];

export const defaultTaskTypes = [
  { value: "none", label: "None" },
  { value: "email", label: "Email" },
  { value: "demo", label: "Demo" },
  { value: "lunch", label: "Lunch" },
  { value: "meeting", label: "Meeting" },
  { value: "follow-up", label: "Follow-up" },
  { value: "thank-you", label: "Thank you" },
  { value: "site-visit", label: "Site visit" },
  { value: "technical-submittal", label: "Technical submittal" },
  { value: "call", label: "Call" },
];

export const defaultConfiguration: ConfigurationContextValue = {
  companySectors: defaultCompanySectors,
  currency: defaultCurrency,
  dealCategories: defaultDealCategories,
  dealPipelineStatuses: defaultDealPipelineStatuses,
  dealStages: defaultDealStages,
  inHandDealStages: defaultInHandDealStages,
  engineBrands: defaultEngineBrands,
  alternatorBrands: defaultAlternatorBrands,
  noteStatuses: defaultNoteStatuses,
  taskTypes: defaultTaskTypes,
  title: defaultTitle,
  darkModeLogo: defaultDarkModeLogo,
  lightModeLogo: defaultLightModeLogo,
};
