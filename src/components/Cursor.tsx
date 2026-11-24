"use client";

import { useEffect, useRef } from "react";
import { gsap, MQ } from "@/lib/gsap";
import s from "./Cursor.module.css";

type State = "default" | "link" | "view" | "drag";

/**
 * Cursor ligero (punto + anillo) sólo para punteros finos.
 * Estados por atributo:  data-cursor="view" | "drag" (+ data-cursor-label="Ver")
 * Los enlaces y botones activan "link" automáticamente.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Activo con cualquier puntero fino. Con reduced motion se mantiene (sigue al usuario,
    // no es animación autónoma) pero sin inercia.
    if (!window.matchMedia(MQ.fine).matches) return;
    const reduce = window.matchMedia(MQ.reduce).matches;

    const html = document.documentElement;
    html.classList.add("has-cursor");

    const lag = (d: number) => ({ duration: reduce ? 0.01 : d, ease: "power3" });
    const dx = gsap.quickTo(dot.current, "x", lag(0.12));
    const dy = gsap.quickTo(dot.current, "y", lag(0.12));
    const rx = gsap.quickTo(ring.current, "x", lag(0.45));
    const ry = gsap.quickTo(ring.current, "y", lag(0.45));

    let visible = false;
    let state: State = "default";

    const setState = (next: State, text = "") => {
      if (next === state && label.current?.textContent === text) return;
      state = next;
      ring.current!.dataset.state = next;
      dot.current!.dataset.state = next;
      if (label.current) label.current.textContent = text;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // mouse, pen y touchpad (algunos drivers de Windows reportan "pen")
      if (!visible) {
        visible = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);

      const t = e.target as HTMLElement;
      const custom = t.closest<HTMLElement>("[data-cursor]");
      if (custom) {
        setState(custom.dataset.cursor as State, custom.dataset.cursorLabel ?? "");
      } else if (t.closest("a, button, [role='button'], input, textarea, select, summary")) {
        setState("link");
      } else {
        setState("default");
      }
    };

    const onLeave = () => {
      visible = false;
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 });
    };
    const onDown = () => ring.current?.classList.add(s.pressed);
    const onUp = () => ring.current?.classList.remove(s.pressed);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <>
      <div ref={ring} className={s.ring} data-state="default" aria-hidden="true">
        <span ref={label} className={s.label} />
      </div>
      <div ref={dot} className={s.dot} data-state="default" aria-hidden="true" />
    </>
  );
}
