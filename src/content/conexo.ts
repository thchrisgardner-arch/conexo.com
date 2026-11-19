/**
 * Contenido comercial de Conexo.
 * Fuente de verdad: https://weareconexo.com (revisado 2026-10-07).
 * No agregar servicios, clientes, cifras ni precios que no existan en esa fuente.
 */

export const site = {
  name: "Conexo",
  tagline: "Aliado integral digital",
  url: "https://weareconexo.com",
  email: "hola@weareconexo.com",
  phone: "+57 304 143 8766",
  phoneHref: "tel:+573041438766",
  description:
    "Desarrollo web, automatizaciones y soporte técnico en un solo lugar. Sin enredos. Con resultados.",
  allProjectsUrl: "https://weareconexo.com/proyectos",
};

/** Imágenes de proyectos: hoy se sirven desde la web actual. Para producción, copiar a /public/work y cambiar esta base. */
export const WORK_IMAGE_BASE = "https://weareconexo.com/work";

export const nav = [
  { label: "Servicios", href: "#servicios" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Proceso", href: "#proceso" },
  { label: "Planes", href: "#planes" },
];

export const stats = [
  { value: "3", label: "pilares, un solo aliado" },
  { value: "24/7", label: "acompañamiento técnico" },
  { value: "100%", label: "integrado: web + automatización + soporte" },
];

export type Accent = "green" | "blue" | "pink" | "yellow";

export type Service = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  accent: Accent;
  links: string[];
};

export const services: Service[] = [
  {
    id: "web",
    title: "Desarrollo web",
    description: "Sitios rápidos, modernos y optimizados para convertir.",
    tags: ["Next.js", "Shopify", "WordPress", "Webflow"],
    accent: "blue",
    links: ["ecommerce", "hosting", "auto"],
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    description: "Vende online con una tienda lista para escalar.",
    tags: ["Pasarelas", "Catálogo", "Carrito", "Multi-moneda"],
    accent: "pink",
    links: ["web", "auto", "hosting"],
  },
  {
    id: "auto",
    title: "Automatizaciones",
    description: "Ahorra tiempo conectando tus herramientas con flujos e IA.",
    tags: ["APIs", "n8n", "Webhooks", "Flujos con IA"],
    accent: "green",
    links: ["web", "ecommerce", "paneles", "apps"],
  },
  {
    id: "apps",
    title: "Aplicaciones móviles",
    description: "Tu negocio en el bolsillo de tus clientes.",
    tags: ["React Native", "iOS", "Android", "Push"],
    accent: "yellow",
    links: ["auto", "paneles"],
  },
  {
    id: "paneles",
    title: "Paneles administrativos",
    description: "Control total de tu operación en una sola pantalla.",
    tags: ["Dashboards", "CRM", "Sistemas internos", "Reportería"],
    accent: "blue",
    links: ["auto", "apps", "hosting"],
  },
  {
    id: "hosting",
    title: "Hosting y mantenimiento",
    description: "Tu web online, segura y actualizada todo el año.",
    tags: ["SSL", "CDN global", "Backups", "Monitoreo"],
    accent: "green",
    links: ["web", "ecommerce", "paneles"],
  },
];

export const pillars = [
  {
    n: "01",
    title: ["Desarrollo", "web"],
    description: "Sitios y plataformas rápidas, modernas y hechas para convertir.",
    keywords: ["Sitios", "Plataformas", "E-commerce", "Apps"],
    accent: "blue" as Accent,
  },
  {
    n: "02",
    title: ["Automa-", "tización"],
    description: "Conectamos tus herramientas para que el trabajo repetitivo desaparezca.",
    keywords: ["APIs", "n8n", "Webhooks", "IA"],
    accent: "green" as Accent,
  },
  {
    n: "03",
    title: ["Configuración", "y soporte"],
    description: "Infraestructura, mantenimiento y acompañamiento real, siempre.",
    keywords: ["Infraestructura", "Monitoreo", "Backups", "24/7"],
    accent: "yellow" as Accent,
  },
];

export const projects = [
  {
    name: "Kontrola",
    category: "SaaS · Pymes",
    description:
      "Software en la nube que integra contabilidad, inventarios, facturación electrónica y punto de venta en una sola plataforma.",
    url: "https://kontrola.com.co/",
    image: "kontrola.webp",
  },
  {
    name: "Almacén Sandra",
    category: "E-commerce · Belleza",
    description:
      "Tienda de productos de belleza y estética con financiación en línea y catálogo de maquillaje, cuidado capilar y kits para academia.",
    url: "https://almacensandra.com.co/",
    image: "almacensandra.webp",
  },
  {
    name: "Cajacopi",
    category: "Institucional · Caja de compensación",
    description:
      "Portal institucional con información de servicios, afiliación, matrículas y eventos para usuarios en la Costa Caribe.",
    url: "https://cajacopi.com/",
    image: "cajacopi.webp",
  },
  {
    name: "AV Prada",
    category: "Seguros · Comunidad latina (EE. UU.)",
    description:
      "Sitio de agencia de seguros con asesoría en español para seguros de salud, vida, auto y hogar.",
    url: "https://www.avprada.com/",
    image: "avprada.webp",
  },
  {
    name: "Sushi2GO",
    category: "App · Food delivery",
    description:
      "Plataforma de pedidos de sushi con entrega express en Barranquilla, Bogotá y Medellín.",
    url: "https://www.sushi2go.com.co/",
    image: "sushi2go.webp",
  },
  {
    name: "Bambú Residences",
    category: "Inmobiliario · Inversión",
    description:
      "Landing de inversión inmobiliaria llave en mano: suites amobladas con operación turística en Alto Prado, Barranquilla.",
    url: "https://l.bamburesidences.com/",
    image: "bamburesidences.webp",
  },
  {
    name: "Dinhomer",
    category: "Inmobiliario · Constructora",
    description:
      "Sitio corporativo con catálogo de proyectos residenciales y comerciales, y asesoría en inversión extranjera.",
    url: "https://dinhomer.com/",
    image: "dinhomer.webp",
  },
  {
    name: "Tachón Librería",
    category: "E-commerce · Librería",
    description:
      "Librería en línea con envío gratis a toda Colombia, especializada en libros que transforman la forma de pensar.",
    url: "https://tachonlibreria.com/",
    image: "tachonlibreria.webp",
  },
];

export const TOTAL_PROJECTS = 20;

export const manifesto =
  "Una marca que une en un solo lugar lo que necesitas para estar online: claridad, velocidad y soluciones integradas. Tecnología sin enredos, con un aliado real que no desaparece al entregar.";

export const differentiators = [
  {
    n: "01",
    title: ["Simplificamos", "lo digital."],
    description:
      "Acceso claro y práctico a soluciones web integrales, sin la complejidad técnica de siempre.",
  },
  {
    n: "02",
    title: ["Un solo", "aliado."],
    description: "Web, automatización, configuración y soporte en una sola conversación.",
  },
  {
    n: "03",
    title: ["Te acompañamos", "de verdad."],
    description: "No desaparecemos al entregar. Soporte cercano, transparente y constante.",
  },
  {
    n: "04",
    title: ["Resultados que", "se miden."],
    description: "Soluciones que se ven, se sienten y se reflejan en tus números.",
  },
];

export const process = [
  {
    n: "01",
    title: "Briefing",
    description: "Entendemos tu negocio, tu audiencia y los objetivos reales del proyecto.",
  },
  {
    n: "02",
    title: "Propuesta",
    description: "Te presentamos la solución ideal con alcance, tiempos e inversión claros.",
  },
  {
    n: "03",
    title: "Desarrollo",
    description: "Construimos con atención al detalle y entregas iterativas cada semana.",
  },
  {
    n: "04",
    title: "Lanzamiento",
    titleExtra: "y acompañamiento",
    description: "Salimos al aire, medimos resultados y seguimos contigo para escalar.",
  },
];

export const plans = [
  {
    id: "esencial",
    eyebrow: "Mantenimiento",
    name: "Esencial",
    description: "Para sitios estables que necesitan estar al día, sin sorpresas.",
    features: [
      "Actualizaciones de plugins y CMS",
      "Backups semanales",
      "Soporte por ticket",
      "Reporte trimestral",
    ],
    featured: false,
  },
  {
    id: "crecimiento",
    eyebrow: "El más elegido",
    name: "Crecimiento",
    description: "Para marcas en crecimiento que no pueden permitirse caer.",
    features: [
      "Todo lo del plan Esencial",
      "Monitoreo 24/7 con alertas",
      "Soporte prioritario",
      "Reportes mensuales de performance",
      "Horas de cambios incluidas cada mes",
    ],
    featured: true,
  },
  {
    id: "enterprise",
    eyebrow: "A tu medida",
    name: "Enterprise",
    description: "Equipo dedicado y SLA contractual para tu operación.",
    features: [
      "Todo lo del plan Crecimiento",
      "Desarrollos nuevos incluidos",
      "SLA contractual garantizado",
      "Account manager dedicado",
    ],
    featured: false,
  },
];

export const marquee = [
  "Desarrollo web",
  "E-commerce",
  "Automatización",
  "Apps móviles",
  "Dashboards",
  "Hosting y soporte",
  "Flujos con IA",
  "Aliado integral",
];
