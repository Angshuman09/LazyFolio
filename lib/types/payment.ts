export type ArticlePlan = "monthly" | "yearly" | "lifetime";

export interface PlanConfig {
  id: ArticlePlan;
  name: string;
  price: string;
  cadence: string;
  subtext?: string;
  cta: string;
}
