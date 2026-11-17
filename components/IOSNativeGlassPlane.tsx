"use client";

import { useEffect, useRef, type RefObject } from "react";
import { createPortal } from "react-dom";

/**
 * iOS WebKit glass is composited from the browser's real backdrop pixels.
 * It does NOT replay the DOM into Canvas and therefore also sees photographs,
 * CSS backgrounds, animated SVG and the independently animated WebGL bubbles.
 *
 * A body-level portal prevents ancestor opacity/filter/clip layers (including
 * Framer Motion's animated navigation container) from limiting that backdrop.
 * The existing interactive navbar stays in place above this visual-only plane.
 */
export function IOSNativeGlassPlane({
  target,
  variant
}: {
  target: RefObject<HTMLDivElement>;
  variant: "bar" | "menu";
}) {
  const planeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = target.current;
    const glass = planeRef.current;
    if (!host || !glass) return;

    let positionFrame = 0;
    let entranceFrame = 0;
    let lastPosition = "";

    const align = () => {
      const bounds = host.getBoundingClientRect();
      if (!host.isConnected || bounds.width < 1 || bounds.height < 1) {
        glass.style.visibility = "hidden";
        return;
      }

      const signature = [bounds.left, bounds.top, bounds.width, bounds.height]
        .map((value) => value.toFixed(2))
        .join(":");
      glass.style.visibility = "visible";
      if (signature === lastPosition) return;
      lastPosition = signature;

      glass.style.left = `${bounds.left}px`;
      glass.style.top = `${bounds.top}px`;
      glass.style.width = `${bounds.width}px`;
      glass.style.height = `${bounds.height}px`;
      glass.style.zIndex = variant === "bar" ? "49" : "39";
    };

    const scheduleAlign = () => {
      if (positionFrame) return;
      positionFrame = requestAnimationFrame(() => {
        positionFrame = 0;
        align();
      });
    };

    const resizeObserver = new ResizeObserver(scheduleAlign);
    resizeObserver.observe(host);
    const container = host.closest("nav, #mobile-navigation-menu");
    if (container) resizeObserver.observe(container);

    window.addEventListener("scroll", scheduleAlign, { passive: true });
    window.addEventListener("resize", scheduleAlign);
    window.addEventListener("orientationchange", scheduleAlign);

    const viewport = window.visualViewport;
    viewport?.addEventListener("scroll", scheduleAlign, { passive: true });
    viewport?.addEventListener("resize", scheduleAlign);

    // Follow the navbar's 600 ms entrance and the menu transition.
    // No permanent requestAnimationFrame loop or expensive pixel readback.
    const started = performance.now();
    const followEntrance = () => {
      align();
      if (performance.now() - started < 850) {
        entranceFrame = requestAnimationFrame(followEntrance);
      }
    };
    followEntrance();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleAlign);
      window.removeEventListener("resize", scheduleAlign);
      window.removeEventListener("orientationchange", scheduleAlign);
      viewport?.removeEventListener("scroll", scheduleAlign);
      viewport?.removeEventListener("resize", scheduleAlign);
      cancelAnimationFrame(positionFrame);
      cancelAnimationFrame(entranceFrame);
    };
  }, [target, variant]);

  // The parent only mounts this component after a client-side iOS check.
  return createPortal(
    <div
      aria-hidden="true"
      data-ios-native-glass=""
      data-variant={variant}
      className="ios-native-glass-plane"
      ref={planeRef}
    />,
    document.body
  );
}
