import { StackItem } from "../../shared/types";
import { Divider, SectionHeading } from "./utils";

const Stack = ({ stack }: { stack: StackItem[] }) => {
  if (!stack || stack.length === 0) return null;
  return (
    <>
      <Divider />
      <section>
        <SectionHeading>Expertise</SectionHeading>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {stack.map((item) => (
            <span
              key={item.name}
              className="text-[12px] font-mono"
              style={{ color: "#7A6C5D" }}
            >
              {item.name}
            </span>
          ))}
        </div>
      </section>
    </>
  );
};

export default Stack;
