import { DeliveryTruck } from "./delivery-truck";

type Fill =
  | "fill-brand"
  | "fill-brand-700"
  | "fill-brand-400"
  | "fill-brand-300"
  | "fill-brand-200"
  | "fill-brand-100"
  | "fill-coral";

type Box = [x: number, y: number, width: number, height: number, fill: Fill];

const RACK_BOXES: Box[] = [
  [80, 204, 26, 22, "fill-brand-300"],
  [110, 210, 24, 16, "fill-coral"],
  [150, 206, 30, 20, "fill-brand-300"],
  [184, 212, 22, 14, "fill-brand"],
  [220, 204, 28, 22, "fill-brand-300"],
  [252, 210, 26, 16, "fill-brand-200"],
  [82, 250, 28, 20, "fill-brand"],
  [116, 254, 22, 16, "fill-brand-300"],
  [150, 248, 26, 22, "fill-brand-300"],
  [182, 252, 24, 18, "fill-coral"],
  [222, 250, 30, 20, "fill-brand-300"],
  [256, 256, 22, 14, "fill-brand"],
  [80, 292, 30, 22, "fill-brand-300"],
  [116, 298, 22, 16, "fill-brand-200"],
  [150, 294, 26, 20, "fill-brand"],
  [186, 298, 20, 16, "fill-brand-300"],
  [220, 292, 28, 22, "fill-coral"],
  [252, 298, 28, 16, "fill-brand-300"],
];

const POPPING_BOXES = new Set([1, 9, 16]);

const SHELF_ITEMS: Box[] = [
  [914, 232, 10, 18, "fill-coral"],
  [928, 232, 10, 18, "fill-coral"],
  [944, 228, 12, 22, "fill-brand"],
  [962, 234, 10, 16, "fill-brand-300"],
  [976, 230, 14, 20, "fill-coral"],
  [994, 232, 10, 18, "fill-brand"],
  [914, 268, 14, 20, "fill-brand-300"],
  [932, 272, 10, 16, "fill-brand"],
  [946, 268, 10, 20, "fill-coral"],
  [960, 270, 14, 18, "fill-brand-300"],
  [978, 266, 10, 22, "fill-brand"],
  [992, 270, 12, 18, "fill-coral"],
  [914, 306, 12, 20, "fill-brand"],
  [930, 308, 10, 18, "fill-brand-300"],
  [944, 304, 14, 22, "fill-coral"],
  [962, 308, 10, 18, "fill-brand"],
  [976, 306, 12, 20, "fill-brand-300"],
  [992, 310, 12, 16, "fill-coral"],
];

const SHELF_DELAY_SECONDS = 0.28;
const RACK_DELAY_SECONDS = 0.6;
const RACK_POSTS = [72, 142, 212, 284];
const RACK_SHELVES = [226, 270, 314];
const BELT_BOXES = 3;
const BELT_ROLLERS = 15;
const STORE_SHELVES = [250, 288];
const AWNING_STRIPES = 7;

function delayStyle(seconds: number) {
  return { "--delay": `${seconds}s` } as React.CSSProperties;
}

interface SupplyChainIllustrationProps {
  label: string;
  storeSign: string;
}

export function SupplyChainIllustration({
  label,
  storeSign,
}: SupplyChainIllustrationProps) {
  return (
    <svg
      viewBox="0 0 1120 380"
      role="img"
      aria-label={label}
      className="block h-auto w-full"
    >
      <path
        className="supply-dash stroke-brand-300"
        d="M150 62 C400 6 720 6 980 62"
        fill="none"
        strokeWidth="2"
        strokeDasharray="4 8"
        strokeLinecap="round"
      />
      <path
        className="stroke-brand-300"
        d="M972 52 l10 10 -13 4"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        className="stroke-brand-300"
        x1="0"
        y1="340"
        x2="1120"
        y2="340"
        strokeWidth="2"
      />

      <g className="supply-zone" data-zone="warehouse">
        <path className="fill-brand" d="M40 160 L180 96 L320 160 Z" />
        <rect
          className="fill-white"
          x="140"
          y="120"
          width="80"
          height="22"
          rx="5"
        />
        <text
          className="fill-brand font-display"
          x="180"
          y="136"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          letterSpacing="2"
        >
          COSMO
        </text>
        <rect
          className="fill-white stroke-brand"
          x="52"
          y="160"
          width="256"
          height="180"
          strokeWidth="3"
        />
        <rect
          className="fill-brand-100"
          x="72"
          y="184"
          width="216"
          height="156"
        />
        {RACK_POSTS.map((x) => (
          <rect
            key={x}
            className="fill-brand-400"
            x={x}
            y="184"
            width="4"
            height="156"
          />
        ))}
        {RACK_SHELVES.map((y) => (
          <rect
            key={y}
            className="fill-brand-400"
            x="72"
            y={y}
            width="216"
            height="4"
          />
        ))}
        {RACK_BOXES.map(([x, y, width, height, fill], index) => {
          const isPopping = POPPING_BOXES.has(index);

          return (
            <rect
              key={`${x}-${y}`}
              className={isPopping ? `${fill} supply-pop` : fill}
              style={
                isPopping ? delayStyle(-index * RACK_DELAY_SECONDS) : undefined
              }
              x={x}
              y={y}
              width={width}
              height={height}
              rx="2"
            />
          );
        })}
      </g>

      <g className="supply-zone" data-zone="inventory">
        <rect
          className="fill-brand-400"
          x="330"
          y="300"
          width="6"
          height="40"
        />
        <rect
          className="fill-brand-400"
          x="548"
          y="300"
          width="6"
          height="40"
        />
        <g>
          {Array.from({ length: BELT_BOXES }, (_, index) => (
            <g key={index} className="supply-box">
              <rect
                className="fill-brand-400"
                x="296"
                y="262"
                width="32"
                height="26"
                rx="3"
              />
              <rect
                className="fill-white"
                x="310"
                y="262"
                width="4"
                height="26"
                opacity="0.8"
              />
            </g>
          ))}
        </g>
        <rect
          className="fill-brand"
          x="310"
          y="288"
          width="270"
          height="12"
          rx="6"
        />
        {Array.from({ length: BELT_ROLLERS }, (_, index) => (
          <circle
            key={index}
            className="fill-brand-400"
            cx={322 + index * 17.5}
            cy="294"
            r="2.5"
          />
        ))}
        <rect
          className="supply-beam fill-coral"
          x="418"
          y="212"
          width="54"
          height="3"
          rx="1.5"
        />
        <path
          className="stroke-brand-700"
          d="M410 288 V206 Q410 196 420 196 H470 Q480 196 480 206 V288"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <rect
          className="fill-brand-400"
          x="528"
          y="210"
          width="4"
          height="78"
        />
        <rect
          className="fill-brand-700"
          x="500"
          y="166"
          width="62"
          height="48"
          rx="6"
        />
        <rect
          className="fill-brand-400"
          x="510"
          y="178"
          width="26"
          height="4"
          rx="2"
        />
        <rect
          className="fill-brand-400"
          x="510"
          y="188"
          width="18"
          height="4"
          rx="2"
        />
        <g className="supply-check">
          <circle className="fill-coral" cx="546" cy="198" r="9" />
          <path
            className="stroke-white"
            d="M542 198 l3 3 5 -6"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>

      <g className="supply-zone" data-zone="distribution">
        <rect
          className="fill-brand-100"
          x="580"
          y="342"
          width="300"
          height="22"
        />
        <line
          className="supply-dash stroke-white"
          x1="580"
          y1="353"
          x2="880"
          y2="353"
          strokeWidth="3"
          strokeDasharray="16 14"
        />
        <g className="stroke-brand-300" strokeWidth="3" strokeLinecap="round">
          <line className="supply-whoosh" x1="560" y1="240" x2="586" y2="240" />
          <line className="supply-whoosh" x1="548" y1="264" x2="584" y2="264" />
          <line className="supply-whoosh" x1="562" y1="288" x2="588" y2="288" />
        </g>
        <DeliveryTruck />
      </g>

      <g className="supply-zone" data-zone="retail">
        <rect
          className="fill-brand-700"
          x="930"
          y="116"
          width="120"
          height="26"
          rx="6"
        />
        <text
          className="fill-white font-display"
          x="990"
          y="134"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          letterSpacing="1.5"
        >
          {storeSign}
        </text>
        <rect
          className="fill-white stroke-brand"
          x="892"
          y="176"
          width="196"
          height="164"
          strokeWidth="3"
        />
        <rect
          className="fill-brand-700"
          x="880"
          y="150"
          width="220"
          height="10"
          rx="4"
        />
        {Array.from({ length: AWNING_STRIPES }, (_, index) => {
          const fill = index % 2 ? "fill-brand-300" : "fill-brand";

          return (
            <g key={index} className={fill}>
              <rect x={885 + index * 30} y="160" width="30" height="26" />
              <circle cx={900 + index * 30} cy="186" r="15" />
            </g>
          );
        })}
        <rect
          className="fill-brand-100 stroke-brand"
          x="906"
          y="214"
          width="104"
          height="112"
          rx="4"
          strokeWidth="2"
        />
        {STORE_SHELVES.map((y) => (
          <rect
            key={y}
            className="fill-brand-400"
            x="906"
            y={y}
            width="104"
            height="3"
          />
        ))}
        {SHELF_ITEMS.map(([x, y, width, height, fill], index) => (
          <rect
            key={`${x}-${y}`}
            className={`${fill} supply-item`}
            style={delayStyle(index * SHELF_DELAY_SECONDS)}
            x={x}
            y={y}
            width={width}
            height={height}
            rx="2.5"
          />
        ))}
        <rect
          className="fill-brand-200 stroke-brand"
          x="1024"
          y="232"
          width="50"
          height="108"
          strokeWidth="2"
        />
        <circle className="fill-brand" cx="1032" cy="290" r="3" />
      </g>
    </svg>
  );
}
