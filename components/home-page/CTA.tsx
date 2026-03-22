'use client'

const CTA = () => {
  return (
          <section className="max-w-5xl mx-auto px-4 md:px-6 mb-28">
        <div className="bg-(--lf-ink) text-(--lf-bg) rounded-3xl px-8 py-20 text-center">
          <h2 className="font-serif-display text-[clamp(2rem,5vw,3rem)] font-bold leading-tight mb-4">
            Your Portfolio,
            <br />
            <span className="opacity-40">Finally Done Right.</span>
          </h2>
          <p className="text-[0.9rem] font-medium opacity-50 leading-relaxed mb-10 max-w-sm mx-auto">
            Set up in under 5 minutes. No design skills needed. Just pick your
            profession and go.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-(--lf-bg) text-(--lf-ink) text-[0.88rem] font-semibold px-7 py-3.5 rounded-full hover:opacity-80 transition-opacity"
          >
            Start for free
            <span className="btn-arrow w-5 h-5 bg-(--lf-ink) text-(--lf-bg) rounded-full inline-flex items-center justify-center text-[10px] font-bold leading-none">
              ↗
            </span>
          </a>
        </div>
      </section>
  )
}

export default CTA