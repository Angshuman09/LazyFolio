"use client";

const HowToUse = () => {
  return (
    <section className="max-w-5xl mx-auto px-5 md:px-6 pb-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          {
            title: "Create your profile",
            text: "Add your story, links, projects, and contact details.",
          },
          {
            title: "Choose a template",
            text: "Pick a layout that suits your work and personality.",
          },
          {
            title: "Share your link",
            text: "Publish a clean page at your Lazyfolio username.",
          },
        ].map((step, index) => (
          <div
            key={step.title}
            className="rounded-xl border border-(--lf-border) bg-(--lf-surface) px-5 py-5 text-left"
          >
            <div className="text-[0.68rem] font-mono uppercase tracking-widest text-(--lf-muted) mb-8">
              0{index + 1}
            </div>
            <h2 className="text-[1rem] font-semibold text-(--lf-ink) mb-2">
              {step.title}
            </h2>
            <p className="text-[0.8rem] leading-relaxed text-(--lf-muted)">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowToUse;
