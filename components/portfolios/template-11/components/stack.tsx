import { StackItem } from "../../shared/types";
import { SectionLabel, MobileSectionLabel, SectionGap } from "./utils";

const Stack = ({ stack }: { stack: StackItem[] }) => {
  if (!stack || stack.length === 0) return null;

  const MONO: React.CSSProperties = {
    fontFamily: "'Courier New', Courier, monospace",
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-0 sm:gap-8">
        <SectionLabel>Skills</SectionLabel>
        <div className="flex-1 min-w-0">
          <MobileSectionLabel>Skills</MobileSectionLabel>
          <p
            className="text-[12.5px] leading-relaxed"
            style={{ color: "#374151", ...MONO }}
          >
            {stack.map((item) => item.name).join(", ")}
          </p>
        </div>
      </div>
      <SectionGap />
    </>
  );
};

export default Stack;
