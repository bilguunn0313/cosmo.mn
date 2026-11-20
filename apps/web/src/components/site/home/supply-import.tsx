const FACTORY_WINDOWS = [-366, -322, -278];
const DOOR_LINES = [292, 302, 312, 322, 332];
const SLEEPER_COUNT = 27;
const SLEEPER_STEP = 16;
const WAGON_RIDGES = [1, 2, 3, 4, 5];

interface WheelProps {
  x: number;
  size?: "small" | "large";
}

function Wheel({ x, size = "small" }: WheelProps) {
  const isLarge = size === "large";

  return (
    <>
      <circle className="fill-brand-700" cx={x} cy="332" r={isLarge ? 8 : 7} />
      <circle
        className="fill-brand-400"
        cx={x}
        cy="332"
        r={isLarge ? 3 : 2.5}
      />
    </>
  );
}

export function SupplyImport() {
  return (
    <g className="supply-zone" data-zone="import">
      <line
        className="stroke-brand"
        x1="-400"
        y1="340"
        x2="40"
        y2="340"
        strokeWidth="3"
      />
      {Array.from({ length: SLEEPER_COUNT }, (_, index) => (
        <rect
          key={index}
          className="fill-brand-300"
          x={-396 + index * SLEEPER_STEP}
          y="342"
          width="8"
          height="5"
        />
      ))}

      <rect
        className="fill-brand-700"
        x="-372"
        y="136"
        width="20"
        height="60"
      />
      <rect className="fill-coral" x="-372" y="148" width="20" height="8" />
      <path
        className="fill-brand"
        d="M-388 222 V190 L-348 210 V190 L-308 210 V190 L-268 210 V190 L-224 210 V222 Z"
      />
      <rect
        className="fill-white stroke-brand"
        x="-384"
        y="220"
        width="160"
        height="120"
        strokeWidth="3"
      />
      <rect
        className="fill-brand-100"
        x="-372"
        y="236"
        width="136"
        height="28"
      />
      {FACTORY_WINDOWS.map((x) => (
        <rect
          key={x}
          className="fill-brand-300"
          x={x}
          y="240"
          width="34"
          height="20"
          rx="3"
        />
      ))}
      <rect
        className="fill-brand-400"
        x="-292"
        y="280"
        width="56"
        height="60"
      />
      {DOOR_LINES.map((y) => (
        <line
          key={y}
          className="stroke-white"
          x1="-292"
          y1={y}
          x2="-236"
          y2={y}
          strokeWidth="2"
        />
      ))}
      <g transform="translate(-346 306)" fill="none">
        <circle
          className="stroke-brand"
          r="15"
          strokeWidth="5"
          strokeDasharray="5 4.42"
        />
        <circle className="stroke-brand" r="8" strokeWidth="3" />
        <circle className="fill-coral" r="3" />
      </g>

      <g className="supply-train">
        <rect
          className="fill-coral"
          x="-176"
          y="284"
          width="86"
          height="34"
          rx="2"
        />
        {WAGON_RIDGES.map((ridge) => (
          <line
            key={ridge}
            className="stroke-white/45"
            x1={-176 + ridge * 14.3}
            y1="288"
            x2={-176 + ridge * 14.3}
            y2="314"
            strokeWidth="2"
          />
        ))}
        <rect
          className="fill-brand-700"
          x="-180"
          y="318"
          width="94"
          height="8"
        />
        <Wheel x={-162} />
        <Wheel x={-104} />
        <rect className="fill-brand-700" x="-86" y="320" width="8" height="4" />
        <path
          className="fill-brand"
          d="M-78 326 V282 Q-78 272 -68 272 H-24 Q-6 272 -2 290 L2 326 Z"
        />
        <rect
          className="fill-brand-200"
          x="-34"
          y="280"
          width="22"
          height="16"
          rx="3"
        />
        <rect className="fill-coral" x="-78" y="306" width="80" height="6" />
        <rect
          className="fill-brand-700"
          x="-68"
          y="262"
          width="12"
          height="12"
        />
        <Wheel x={-60} size="large" />
        <Wheel x={-16} size="large" />
      </g>
    </g>
  );
}
