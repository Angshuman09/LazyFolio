type SectionHeadingProps = {
  title: string;
  description: string;
};

export function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <header className="mb-8 border-b border-(--lf-border-alpha) pb-6">
      <h1 className="font-serif-display text-[1.55rem] font-medium leading-tight tracking-tight text-(--lf-ink) sm:text-[1.45rem]">
        {title}
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-(--lf-muted)">{description}</p>
    </header>
  );
}
