import { useId } from "react";

export const roomWidth = 768;
export const roomHeight = 512;

const layerBounds = {
  architecture: [0, 0, 768, 512],
  bed: [252.5, 175, 380, 293],
  equipment: [46, 46, 700, 362],
  monitor: [482, 73, 143, 104],
  staff: [196, 107.5, 72, 346.5],
  "staff-forearm": [266, 192.5, 57.5, 37],
  "patient-head": [484, 154, 54.5, 75],
  "patient-chest": [438, 209.5, 110.5, 62],
  "patient-hand": [442, 264, 102, 32]
} as const;

function Layer({ name, motion }: { name: keyof typeof layerBounds; motion?: string }) {
  const [x, y, width, height] = layerBounds[name];

  return (
    <image href={`/learning-lab/room/${name}.webp`}
      data-layer={name} className={motion} x={x} y={y} width={width} height={height} />
  );
}

const pulse = "M0 13H6l2-2 2 2h5l2 3 2.5-12 3 17 2.5-8h4q3-5 7 0h5l2-2 2 2h9";

export default function PatientRoomArt() {
  const lightId = useId();

  return (
    <svg className="ml-room-art" viewBox={`0 0 ${roomWidth} ${roomHeight}`} width={roomWidth} height={roomHeight} aria-hidden="true">
      <defs>
        <linearGradient id={lightId} gradientUnits="userSpaceOnUse" x1="208" y1="34" x2="370" y2="437">
          <stop stopColor="#fff1b8" stopOpacity=".26" />
          <stop offset=".63" stopColor="#efedb1" stopOpacity=".13" />
          <stop offset="1" stopColor="#e3ffc9" stopOpacity=".08" />
        </linearGradient>
      </defs>

      <Layer name="architecture" />
      <g className="ml-room-light" fill={`url(#${lightId})`}>
        <path d="M114 98l123-45v139l-123 48Z" />
        <path d="M254 65l66 55v154l-63 36-143-70 123-48Z" />
        <path d="M258 309l-137 53 270 105 123 28-103-98Z" />
      </g>
      <Layer name="bed" />
      <Layer name="equipment" />
      <Layer name="monitor" />
      <g className="ml-room-ecg" transform="matrix(1 .18 0 1 497 101)">
        <path className="ml-ecg-grid" d="M0 5H54M0 13H54M0 21H54M9 2v21m9-21v21m9-21v21m9-21v21m9-21v21" />
        <path className="ml-ecg-trace" d={pulse} />
        <path className="ml-ecg-sweep" d={pulse} pathLength={100} />
      </g>
      <Layer name="patient-chest" motion="ml-room-breath" />
      <Layer name="patient-head" />
      <Layer name="patient-hand" />
      <Layer name="staff-forearm" motion="ml-room-staff" />
      <Layer name="staff" />
    </svg>
  );
}
