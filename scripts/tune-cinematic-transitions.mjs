import { readFile, writeFile } from "node:fs/promises";

const file = "app/cinematic-responsive.css";
const source = await readFile(file, "utf8");
const marker = "/* Final CMYK registration and material transition tuning. */";

if (source.includes(marker)) {
  console.log("Cinematic transition tuning already present");
  process.exit(0);
}

const css = `

${marker}
.print-transition__plate {
  --register-x: 0vw;
  --register-y: 0vh;
  --register-r: 0deg;
  --exit-x: 0vw;
  --exit-y: 0vh;
  --exit-r: 0deg;
  will-change: transform, opacity, filter;
}
.print-transition__plate--cyan {
  --register-x: -1.45vw;
  --register-y: .9vh;
  --register-r: -.72deg;
  --exit-x: -10vw;
  --exit-y: 5vh;
  --exit-r: -4.5deg;
}
.print-transition__plate--magenta {
  --register-x: 1.3vw;
  --register-y: -1.05vh;
  --register-r: .66deg;
  --exit-x: 10vw;
  --exit-y: -6vh;
  --exit-r: 4.2deg;
}
.print-transition__plate--yellow {
  --register-x: -.58vw;
  --register-y: -1.5vh;
  --register-r: -.38deg;
  --exit-x: -4.5vw;
  --exit-y: -9vh;
  --exit-r: -2.2deg;
}
.print-transition__plate--black {
  --register-x: .72vw;
  --register-y: 1.35vh;
  --register-r: .28deg;
  --exit-x: 5.5vw;
  --exit-y: 9vh;
  --exit-r: 2.1deg;
}

@keyframes plate-register {
  0% { opacity: 0; filter: saturate(1.28) blur(2px); }
  18% { opacity: .58; filter: saturate(1.18) blur(.7px); }
  68% {
    opacity: .72;
    filter: saturate(1.08) blur(0);
    transform: translate3d(var(--register-x), var(--register-y), 0) rotateZ(var(--register-r));
  }
  100% {
    opacity: .12;
    filter: saturate(.94) blur(1px);
    transform: translate3d(var(--exit-x), var(--exit-y), 230px) rotateZ(var(--exit-r)) scale(1.3);
  }
}

@keyframes register-lock {
  0% { opacity: 0; transform: translate(-50%,-50%) scale(2.9) rotate(-24deg); }
  42% { opacity: .72; }
  72% { opacity: .92; transform: translate(-50%,-50%) scale(.92) rotate(0deg); }
  100% { opacity: 0; transform: translate(-50%,-50%) scale(.22) rotate(8deg); }
}

@keyframes sheet-plane {
  0% {
    opacity: .15;
    transform: translate(-50%,-50%) rotateX(72deg) rotateZ(-8deg) scale(.22);
    border-radius: 68% 32% 61% 39% / 38% 66% 34% 62%;
  }
  35% {
    opacity: .9;
    transform: translate(-50%,-50%) rotateX(48deg) rotateZ(3deg) scale(.72);
    border-radius: 57% 43% 48% 52% / 46% 58% 42% 54%;
  }
  72% {
    opacity: 1;
    transform: translate(-50%,-50%) rotateX(12deg) rotateZ(0deg) scale(1.02);
    border-radius: 22% 16% 19% 14% / 18% 23% 15% 21%;
  }
  100% {
    opacity: .08;
    transform: translate(-50%,-50%) rotateX(0deg) rotateZ(0deg) scale(1.38);
    border-radius: 7% 9% 6% 8% / 8% 6% 9% 7%;
  }
}

@keyframes ink-bloom {
  0% { opacity: 0; transform: scale(.025) rotate(-12deg); border-radius: 62% 38% 54% 46% / 41% 65% 35% 59%; }
  38% { opacity: .88; transform: scale(.74) rotate(5deg); border-radius: 48% 52% 36% 64% / 57% 39% 61% 43%; }
  76% { opacity: .78; transform: scale(1.2) rotate(-3deg); border-radius: 58% 42% 63% 37% / 39% 59% 41% 61%; }
  100% { opacity: .12; transform: scale(1.72) rotate(8deg); border-radius: 44% 56% 47% 53% / 62% 41% 59% 38%; }
}

.transition-curtain--print .transition-curtain__depth {
  background:
    radial-gradient(24% 30% at 49% 50%, rgba(255,255,255,.05), transparent 72%),
    radial-gradient(58% 74% at 50% 52%, rgba(28,35,44,.74), #07090d 56%, #010204 86%);
}
.transition-curtain--ui .transition-curtain__depth {
  background:
    radial-gradient(34% 42% at 50% 49%, rgba(0,169,200,.16), transparent 72%),
    radial-gradient(65% 72% at 50% 50%, #0a1016 0, #030508 62%, #010204 100%);
}
.transition-curtain--ink .transition-curtain__depth {
  background:
    radial-gradient(28% 38% at 50% 50%, rgba(209,10,100,.12), transparent 62%),
    radial-gradient(70% 76% at 50% 50%, #101018 0, #040509 58%, #010204 100%);
}

@media (max-width: 820px) {
  .print-transition__plate { width: 94vw; height: 58vh; margin: -29vh 0 0 -47vw; }
  .print-transition__register { width: 24vmin; }
  .ui-transition__sheet { width: 92vw; height: 42vh; }
  .ui-transition__grid { inset: 22vh 5vw; background-size: 18vw 7vh; }
  .ink-transition__pool { width: 105vw; }
  .ink-transition__pool--yellow { width: 74vw; left: 14vw; top: 31vh; }
}
`;

await writeFile(file, source + css, "utf8");
console.log("Applied final cinematic transition tuning");
