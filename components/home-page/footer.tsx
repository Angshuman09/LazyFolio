"use client";

const Footer = () => {
  const navColumns = [
    {
      heading: "The Good",
      links: ["Home", "About", "Work", "Blog"],
    },
    {
      heading: "The Boring",
      links: ["Privacy Policy", "Terms of Service"],
    },
    {
      heading: "The Cool",
      links: ["X", "Instagram", "Github"],
    },
  ];

  return (
    <footer
      className="w-full relative overflow-hidden flex flex-col justify-center items-center bg-(--lf-surface) text-(--lf-ink)"
    >
      {/* Top nav section */}
      <div className="px-8 md:px-16 pt-16 pb-0">
        <div className="flex flex-col md:flex-row gap-12 md:gap-0">

          {/* Nav columns */}
          <div className="flex flex-1 gap-12 md:gap-24 lg:gap-32 xl:gap-48">
            {navColumns.map((col) => (
              <div key={col.heading} className="flex-1">
                <p
                  className="text-sm mb-5 text-(--lf-ink)"
                >
                  {col.heading}
                </p>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link} className="text-(--lf-muted) hover:text-(--lf-ink)">
                      <a
                        href="#"
                        className="text-sm transition-colors duration-150"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="mt-8 select-none pointer-events-none leading-none"
        style={{
          fontSize: "clamp(80px, 18vw, 220px)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 0.85,
          paddingLeft: "0.03em",
          fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
          overflow: "hidden",
          maxHeight: "0.70em",
        }}
      >
        Lazyfolio
      </div>

      {/* tiny spacer so the bleed looks intentional */}
      <div style={{ height: "2rem" }} />
    </footer>
  );
};

export default Footer;