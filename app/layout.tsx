import type { Metadata } from "next";
//@ts-ignore
import "./globals.css";
import { cn } from "@/lib/utils";
import { Instrument_Serif, Geist } from "next/font/google";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next"

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif-display",
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Lazyfolio",
  description: "Make the internet know You Exist",
  icons: {
    icon: "/logo-crop.png",
  },
  openGraph:{
    type:"website",
    url:"https://lazy-folio.vercel.app",
    title: "Lazyfolio - Make the internet know You Exist.",
    description: "Build your portfolio in minutes, not after hours of tweaking layouts and writing everything from scratch >◡<",
    siteName:"Lazyfolio",
    images:[{url:"/graphimage.png"}]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(serif.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem("lf-theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}})();`,
          }}
        />
      </head>
      <body className={cn(geist.variable, serif.variable, "antialiased")}>
        <Toaster position="bottom-right" />
        <Providers>
          {children}
          {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
            <Script
              src="/stats/js/script.js"
              data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
              data-host-url="/stats"
              strategy="afterInteractive"
            />
          )}
          <Analytics/>
        </Providers>
      </body>
    </html>
  );
}