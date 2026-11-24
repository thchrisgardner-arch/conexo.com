import type { Metadata, Viewport } from "next";
import { Inter, Quicksand } from "next/font/google";
import { services, site } from "@/content/conexo";
import "./globals.css";

// Brand Book págs. 10–12: Quicksand (títulos, subtítulos, botones) + Inter (textos y formularios)
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const title = "Conexo — Aliado integral digital | Web, automatización y soporte";
const description =
  "Tu aliado integral digital para crecer sin fricciones. Desarrollo web, e-commerce, automatizaciones, apps móviles, dashboards y soporte técnico en un solo lugar.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: site.url,
    siteName: "Conexo",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#070b0e",
  colorScheme: "dark light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Conexo",
  slogan: "Tu aliado integral digital para crecer sin fricciones.",
  description,
  url: site.url,
  email: site.email,
  telephone: site.phone.replace(/\s/g, ""),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios",
    itemListElement: services.map((sv) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: sv.title, description: sv.description },
    })),
  },
};

// Marca <html> con .js (estados iniciales de animación) antes del primer pintado
const bootScript = `document.documentElement.classList.add('js')`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${quicksand.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style>{`[data-loader]{display:none!important}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
