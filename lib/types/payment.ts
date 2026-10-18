export type ArticlePlan = "monthly" | "yearly" | "lifetime";

export interface PlanConfig {
  id: ArticlePlan;
  name: string;
  tagline: string;
  price: string;
  cadence: string;
  subtext?: string;
  badge?: string;
  features: string[];
  cta: string;
  popular?: boolean;
}
