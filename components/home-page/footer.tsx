'use client'

const Footer = () => {
  return (
    <footer className="border-t border-(--lf-border-alpha) px-6 md:px-12 py-7 flex flex-col md:flex-row items-center justify-between gap-4 text-[0.78rem] font-medium text-(--lf-sub)">
        <span className="font-serif-display text-lg font-normal text-(--lf-ink)">
          Lazyfolio
        </span>
        <span>© 2025 Lazyfolio. Built for creators.</span>
        <div className="flex gap-7">
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a key={l} href="#" className="hover:text-(--lf-ink) transition-colors duration-150">
              {l}
            </a>
          ))}
        </div>
      </footer>
  )
}

export default Footer