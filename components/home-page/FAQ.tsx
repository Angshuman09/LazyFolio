const faqs = [
  {
    question: "What is Lazyfolio?",
    answer:
      "Lazyfolio is a portfolio builder for developers, designers, writers, and indie makers who want a polished personal site without spending hours tweaking layout.",
  },
  {
    question: "Can I publish articles on my portfolio?",
    answer:
      "Yes. You can write internal markdown articles, add images, create custom slugs, and publish them directly to your Lazyfolio portfolio.",
  },
  {
    question: "How many articles are free?",
    answer:
      "Free accounts include 2 published articles. A paid writing plan unlocks unlimited portfolio articles.",
  },
  {
    question: "Do I need to code my portfolio?",
    answer:
      "No. You can choose a template, add your profile, projects, links, experience, and articles from the dashboard.",
  },
  {
    question: "Can I change templates later?",
    answer:
      "Yes. Your content stays separate from the template, so you can switch styles as your portfolio evolves.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FAQ() {
  return (
    <section
      id="faq"
      className="max-w-4xl mx-auto px-5 md:px-6 py-20 scroll-mt-24"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="text-center mb-10">
        <p className="font-mono text-[0.7rem] tracking-widest uppercase text-(--lf-muted) mb-3">
          FAQ
        </p>
        <h2 className="font-serif-display text-3xl sm:text-4xl font-normal leading-tight text-(--lf-ink)">
          A few things people ask.
        </h2>
      </div>

      <div className="border-y border-(--lf-border)">
        {faqs.map((faq, index) => (
          <details
            key={faq.question}
            className="group py-5 border-(--lf-border) open:pb-6 [&:not(:last-child)]:border-b"
            open={index === 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-[0.96rem] font-semibold text-(--lf-ink)">
              <span>{faq.question}</span>
              <span
                aria-hidden="true"
                className="shrink-0 text-(--lf-muted) transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 max-w-2xl text-[0.86rem] leading-relaxed text-(--lf-muted)">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
