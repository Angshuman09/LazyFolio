import Image from "next/image";
import Link from "next/link";
import FooterWordmark from "./footer-wordmark";
import { navColumns } from "@/lib/constants/sections";
const Footer = () => {


  return (
    <footer
      aria-label="Site footer"
      className="w-full relative overflow-hidden bg-(--lf-surface) text-(--lf-ink)"
    >
      <div className="px-6 md:px-12">
        <div className="section-divider" />
      </div>

      <div className="px-8 md:px-16 pt-14 pb-0">
        <div className="flex flex-col md:flex-row gap-12 md:gap-0 max-w-7xl mx-auto">

          <div className="md:w-72 shrink-0 md:pr-16 flex flex-col gap-3">
            <Image src={"/lflogo.png"} width={30} height={30} alt="logo png"/>
            <span className="font-serif-display text-[1.4rem] font-normal tracking-tight text-(--lf-ink)">
              Lazy<span className="text-(--lf-muted)">folio</span>
            </span>
          </div>

          <div className="flex flex-1 gap-12 md:gap-16 lg:gap-24">
            {navColumns.map((col) => (
              <div key={col.heading} className="flex-1">
                <p className="text-[0.7rem] font-semibold uppercase tracking-widest mb-5 text-(--lf-sub)">
                  {col.heading}
                </p>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        target={ col.heading === "The Cool" ? "_blank" : ""}
                        className="text-[0.83rem] text-(--lf-muted) hover:text-(--lf-ink) transition-colors duration-150"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-10 pb-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[0.72rem] text-(--lf-sub)">
            © {new Date().getFullYear()} Lazyfolio. All rights reserved.
          </p>
          <p className="text-[0.72rem] text-(--lf-sub) flex justify-center items-center gap-3">
            Built with ♥ by{" "}
            <Link
              href="https://angshu.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-(--lf-ink) transition-colors underline underline-offset-2 decoration-(--lf-border)"
            >
              <Image src="/angshuman.png" alt="Angshuman" width={30} height={30} />
            </Link>
          </p>
        </div>
      </div>

      <FooterWordmark />
    </footer>
  );
};

export default Footer;
