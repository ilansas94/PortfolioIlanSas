"use client";

/** Quiet, oversized colour lenses inspired by the original CMY emblem.
 * CSS transform animations stay off the React render path and respect reduced motion.
 * Fixed physical positions keep the composition identical in Hebrew and English.
 */
export function BrandAtmosphere() {
  return (
    <div className="brand-atmosphere" aria-hidden="true">
      <div className="brand-wash brand-wash-cyan" />
      <div className="brand-wash brand-wash-gold" />
      <div className="brand-orbit brand-orbit-cyan">
        <div className="brand-lens" />
        <div className="brand-orbit-line" />
        <div className="brand-satellite" />
      </div>
      <div className="brand-orbit brand-orbit-magenta">
        <div className="brand-lens" />
        <div className="brand-orbit-line" />
        <div className="brand-satellite" />
      </div>
      <div className="brand-orbit brand-orbit-gold"><div className="brand-lens" /></div>
    </div>
  );
}
