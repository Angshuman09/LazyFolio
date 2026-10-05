import { StackItem } from "../../shared/types";
import { Divider, SectionHeading } from "./utils";

const Stack = ({ stack }: { stack: StackItem[] }) => {
  if (!stack || stack.length === 0) return null;
  return (
    <>
      <Divider />
      <section>
        <SectionHeading>What I Use</SectionHeading>
        <div className="flex flex-wrap gap-2">
          {stack.map((item) => (
            <span
              key={item.name}
              className="text-[11.5px] font-mono px-2.5 py-1 rounded-md"
            >
              [ {item.name} ]
            </span>
          ))}
        </div>
      </section>
    </>
  );
};

export default Stack;
