
export {
  textValue,
  cleanUrl,
  shouldOpenInNewTab,
  getDomain,
  domainToLabel,
  findKnownLink,
  addProfileContactLinks,
  formatDate,
  formatDateRange,
  splitDescription,
  getBookCallLink,
} from "../../shared/utils";

export const statusStyle: Record<string, string> = {
  Live: "text-emerald-400 bg-emerald-400/8 border-emerald-400/20",
  WIP: "text-amber-400 bg-amber-400/8 border-amber-400/20",
  "Open Source": "text-sky-400 bg-sky-400/8 border-sky-400/20",
};

export const fallbackStatusStyle =
  "text-zinc-400 bg-zinc-400/8 border-zinc-400/20";