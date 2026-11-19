# Conexo — Rediseño web

Sitio de una página para Conexo (aliado integral digital). Next.js 16 + TypeScript + GSAP (ScrollTrigger, SplitText) + Lenis. Sin Tailwind: CSS Modules por componente y tokens globales.

## Comandos

```bash
npm install
npm run dev      # desarrollo en http://localhost:3000
npm run build    # exportación estática en /out (subir esa carpeta a cualquier hosting)
```

## Estructura

```
src/
  app/            layout (SEO, fuentes, JSON-LD), page, globals.css (tokens), sitemap, robots, icon
  content/        conexo.ts  ← TODO el contenido comercial (fuente: weareconexo.com)
  lib/            gsap.ts (plugins + media queries), ready.ts (señal fin de intro)
  components/
    Loader, Cursor, Nav, SmoothScroll, Marquee, Intro, Footer
    hero/         Hero + NodeField (canvas de nodos que reacciona al cursor)
    services/     "Todo conecta": módulos que se expanden y activan cables
    pillars/      3 pilares con scroll storytelling (sección fija en desktop)
    work/         portfolio editorial con vista previa que sigue al cursor
    differentiators/  manifiesto + 4 statements apilados a pantalla completa
    process/      recorrido horizontal (desktop) / línea vertical (mobile)
    plans/        planes con inclinación y nodo que sigue al cursor
    contact/      "¿Conectamos?" con letras que se ensamblan + botón magnético
    ui/           Button, Logo, Connector (glifo de marca)
```

## Sistema de diseño (globals.css)

- **Color:** `--black #111111`, `--white #F7F5EF`, `--green #B7FF3C`, `--blue #5B5BFF`, `--pink #FF6B9D`, `--yellow #FFD84D`
- **Tipografía:** Archivo variable (peso + ancho `wdth`) para display y texto, JetBrains Mono para etiquetas
- **Espaciado:** `--space-2xs … --space-xl`, `--gutter`
- **Radios:** `--radius-sm/md/lg/xl/pill`
- **Movimiento:** `--dur-fast/base/slow`, `--ease-out/in-out/spring`

Pilar → color: Web = azul, Automatización = verde, Soporte = amarillo.

## Breakpoints

Mobile 320–767 · Tablet 768–1023 · Desktop ≥1024 · Large ≥1440.
Las secciones fijas (pilares, proceso horizontal) sólo se activan en desktop **y** sin `prefers-reduced-motion`; en el resto se muestran como bloques apilados.

## Accesibilidad / rendimiento

- `prefers-reduced-motion`: sin intro, sin scroll suave, sin pins, canvas estático.
- Cursor personalizado sólo con puntero fino; estados `default`, `link`, `view` (+ `drag` disponible vía `data-cursor="drag"`).
- Canvas pausado fuera de viewport y con la pestaña oculta. Intro de ~1,3 s, sólo la primera vez por sesión.
- Skip link, foco visible, menú mobile con `Esc`, `inert` y foco inicial.

## Pendiente antes de publicar

1. **Imágenes de proyectos:** hoy se cargan desde `https://weareconexo.com/work/*.webp` (`WORK_IMAGE_BASE` en `content/conexo.ts`). Copiarlas a `public/work/` y cambiar la base a `/work`.
2. **Imagen Open Graph** (1200×630) en `src/app/opengraph-image.png`.
3. Confirmar con Conexo si quieren mostrar el dato "0h tiempo de respuesta" de la web actual (no se usó porque no estaba claro el valor final del contador).
