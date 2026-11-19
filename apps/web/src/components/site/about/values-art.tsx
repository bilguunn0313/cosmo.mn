import { cn } from "@/lib/utils";

type StrokeClass =
  | "stroke-brand"
  | "stroke-brand-300"
  | "stroke-brand-400"
  | "stroke-brand-700"
  | "stroke-coral"
  | "stroke-white";

const HEART =
  "M12 21.4 10.6 20.1C5.4 15.4 2 12.3 2 8.5 2 5.4 4.4 3 7.5 3 9.2 3 10.9 3.8 12 5.1 13.1 3.8 14.8 3 16.5 3 19.6 3 22 5.4 22 8.5 22 12.3 18.6 15.4 13.4 20.1Z";

const ROUTE_DOTS = [
  [253, 282.7],
  [275.9, 278.2],
  [298.1, 271.4],
  [319.8, 262.5],
  [340.9, 252.2],
  [361.5, 240.8],
  [381.8, 228.8],
  [401.7, 216.6],
  [421.4, 204.8],
  [440.8, 193.8],
];

const HILL_TREES = [
  { x: 548, ground: 197.2, size: 26, delay: 900 },
  { x: 578, ground: 201.9, size: 20, delay: 1000 },
  { x: 372, ground: 208.7, size: 18, delay: 950 },
];

const TRUCK_WHEELS = [74, 126, 196];

function rect(x: number, y: number, width: number, height: number, radius = 0) {
  if (!radius) {
    return `M${x} ${y}H${x + width}V${y + height}H${x}Z`;
  }

  const right = x + width;
  const bottom = y + height;
  const arc = `A${radius} ${radius} 0 0 1`;

  return `M${x + radius} ${y}H${right - radius}${arc} ${right} ${y + radius}V${bottom - radius}${arc} ${right - radius} ${bottom}H${x + radius}${arc} ${x} ${bottom - radius}V${y + radius}${arc} ${x + radius} ${y}Z`;
}

function circle(cx: number, cy: number, radius: number) {
  return `M${cx - radius} ${cy}A${radius} ${radius} 0 1 0 ${cx + radius} ${cy}A${radius} ${radius} 0 1 0 ${cx - radius} ${cy}Z`;
}

function sparkle(x: number, y: number, size: number) {
  return `M${x} ${y - size}Q${x} ${y} ${x + size} ${y}Q${x} ${y} ${x} ${y + size}Q${x} ${y} ${x - size} ${y}Q${x} ${y} ${x} ${y - size}Z`;
}

function timing(delay: number, duration = 700) {
  return { "--d": `${delay}ms`, "--t": `${duration}ms` } as React.CSSProperties;
}

interface LineProps {
  d: string;
  delay: number;
  duration?: number;
  width?: number;
  stroke?: StrokeClass;
}

function Line({
  d,
  delay,
  duration = 700,
  width = 3.5,
  stroke = "stroke-brand",
}: LineProps) {
  return (
    <path
      className={cn("art-line", stroke)}
      pathLength={1}
      d={d}
      fill="none"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={timing(delay, duration)}
    />
  );
}

interface FillProps {
  d: string;
  delay: number;
  className: string;
}

function Fill({ d, delay, className }: FillProps) {
  return (
    <path className={cn("art-fill", className)} d={d} style={timing(delay)} />
  );
}

interface ShapeProps {
  d: string;
  fill: string;
  delay: number;
  duration?: number;
  width?: number;
}

function Shape({ d, fill, delay, duration = 600, width = 3.5 }: ShapeProps) {
  return (
    <>
      <Fill d={d} className={fill} delay={delay + duration * 0.75} />
      <Line d={d} delay={delay} duration={duration} width={width} />
    </>
  );
}

interface PopProps {
  delay: number;
  origin?: string;
  children: React.ReactNode;
}

function Pop({ delay, origin = "center", children }: PopProps) {
  return (
    <g
      className="art-pop"
      style={{ ...timing(delay), transformOrigin: origin }}
    >
      {children}
    </g>
  );
}

function Heart({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <path
      className="fill-coral"
      transform={`translate(${x - size / 2} ${y - size / 2}) scale(${size / 24})`}
      d={HEART}
    />
  );
}

interface PersonProps {
  x: number;
  ground: number;
  size: number;
  body: string;
  delay: number;
}

function Person({ x, ground, size, body, delay }: PersonProps) {
  const half = size / 2;
  const shoulders = ground - size * 0.9;
  const outline = `M${x - half} ${ground}V${shoulders}A${half} ${half} 0 0 1 ${x + half} ${shoulders}V${ground}`;

  return (
    <>
      <Fill d={`${outline}Z`} className={body} delay={delay + 450} />
      <Line d={outline} delay={delay} duration={600} />
      <Shape
        d={circle(x, ground - size * 1.48, size * 0.34)}
        fill="fill-white"
        delay={delay + 200}
        duration={450}
      />
    </>
  );
}

function ShoppingBag({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <>
      <Line
        d={`M${x + 14} ${y - 10}V${y - 22}A16 16 0 0 1 ${x + 46} ${y - 22}V${y - 10}`}
        delay={delay}
        duration={400}
        width={4.5}
      />
      <Shape
        d={`M${x + 4} ${y - 10}H${x + 56}L${x + 62} ${y + 64}H${x - 2}Z`}
        fill="fill-brand"
        delay={delay + 200}
      />
      <Line
        d={`M${x + 16} ${y + 22}Q${x + 30} ${y + 34} ${x + 44} ${y + 22}`}
        delay={delay + 900}
        duration={400}
        width={4.5}
        stroke="stroke-white"
      />
    </>
  );
}

interface ArtProps {
  label: string;
}

export function MissionArt({ label }: ArtProps) {
  return (
    <svg
      viewBox="0 36 520 304"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMax meet"
      className="line-art block h-auto w-full overflow-visible"
    >
      <Fill d={circle(260, 198, 134)} className="fill-brand-100" delay={0} />
      <Line
        d="M24 302H496"
        delay={0}
        duration={800}
        width={3}
        stroke="stroke-brand-300"
      />
      <Shape
        d="M318 147V114H340V165Z"
        fill="fill-brand-300"
        delay={650}
        duration={450}
      />
      <Shape
        d={rect(172, 176, 176, 126, 6)}
        fill="fill-white"
        delay={200}
        duration={900}
      />
      <Line d="M150 188L260 100L370 188" delay={420} duration={800} width={7} />
      <Shape
        d={rect(241, 236, 38, 66, 4)}
        fill="fill-brand-200"
        delay={800}
        duration={500}
      />
      <Fill d={circle(270, 270, 3)} className="fill-brand" delay={1350} />
      <Fill
        d={`${rect(190, 200, 34, 32, 4)}${rect(296, 200, 34, 32, 4)}`}
        className="fill-amber"
        delay={1300}
      />
      <Line
        d={rect(190, 200, 34, 32, 4)}
        delay={850}
        duration={500}
        width={3}
      />
      <Line
        d={rect(296, 200, 34, 32, 4)}
        delay={900}
        duration={500}
        width={3}
      />
      <Line
        d="M207 200V232M190 216H224"
        delay={1150}
        duration={350}
        width={2.5}
      />
      <Line
        d="M313 200V232M296 216H330"
        delay={1200}
        duration={350}
        width={2.5}
      />
      <Person x={92} ground={302} size={46} body="fill-coral" delay={1000} />
      <Person
        x={134}
        ground={302}
        size={32}
        body="fill-brand-300"
        delay={1150}
      />
      <ShoppingBag x={388} y={238} delay={1100} />
      <Pop delay={1700}>
        <Heart x={260} y={62} size={36} />
      </Pop>
      <Pop delay={1850}>
        <path
          className="fill-amber"
          d={`${sparkle(204, 84, 8)}${sparkle(318, 70, 6)}${sparkle(448, 196, 7)}`}
        />
      </Pop>
    </svg>
  );
}

export function ValuesArt({ label }: ArtProps) {
  return (
    <svg
      viewBox="0 92 600 228"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMax meet"
      className="line-art block h-auto w-full overflow-visible"
    >
      <Line
        d="M20 286H580"
        delay={0}
        duration={900}
        width={3}
        stroke="stroke-brand-300"
      />

      <g className="values-art-part" data-value="people">
        <Person
          x={76}
          ground={286}
          size={50}
          body="fill-brand-300"
          delay={300}
        />
        <Person x={124} ground={286} size={40} body="fill-coral" delay={450} />
        <Pop delay={1000}>
          <Heart x={100} y={150} size={26} />
        </Pop>
      </g>

      <g className="values-art-part" data-value="satisfaction">
        <ShoppingBag x={194} y={222} delay={750} />
        <Pop delay={1500}>
          <path
            className="fill-amber"
            d={`${sparkle(268, 198, 8)}${sparkle(182, 206, 5)}`}
          />
        </Pop>
      </g>

      <g className="values-art-part" data-value="quality">
        <Shape
          d={rect(302, 214, 92, 72, 6)}
          fill="fill-brand-300"
          delay={1200}
          duration={700}
        />
        <Fill
          d={rect(340, 216, 16, 68)}
          className="fill-brand-200"
          delay={1750}
        />
        <Line
          d="M340 216V284M356 216V284"
          delay={1600}
          duration={400}
          width={2.5}
        />
        <Pop delay={2050}>
          <circle className="fill-coral" cx="394" cy="210" r="20" />
          <path
            className="stroke-white"
            d="M385 210L391 216L403 204"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Pop>
      </g>

      <g className="values-art-part" data-value="responsibility">
        <Shape
          d={rect(503, 200, 12, 86, 6)}
          fill="fill-brand-700"
          delay={1700}
          duration={450}
        />
        <Shape
          d={circle(484, 196, 30)}
          fill="fill-brand-300"
          delay={1850}
          duration={550}
        />
        <Shape
          d={circle(534, 198, 28)}
          fill="fill-brand-300"
          delay={1950}
          duration={550}
        />
        <Shape d={circle(509, 164, 36)} fill="fill-brand-400" delay={2050} />
        <Fill
          d="M509 154C509 144 516 138 525 138C525 148 518 154 509 154Z"
          className="fill-brand"
          delay={2550}
        />
        <Pop delay={2650}>
          <Heart x={509} y={112} size={20} />
        </Pop>
      </g>
    </svg>
  );
}

export function VisionArt({ label }: ArtProps) {
  return (
    <svg
      viewBox="0 92 600 228"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMax meet"
      className="line-art block h-auto w-full overflow-visible"
    >
      <Fill d={circle(486, 176, 66)} className="fill-amber/25" delay={0} />
      <Fill d={circle(486, 176, 44)} className="fill-amber/70" delay={150} />
      <Fill
        d="M250 296C330 206 420 170 600 206V296Z"
        className="fill-brand-100"
        delay={700}
      />
      <Line
        d="M250 296C330 206 420 170 600 206"
        delay={250}
        duration={1000}
        width={3}
        stroke="stroke-brand-400"
      />
      <Line
        d="M20 296H580"
        delay={0}
        duration={800}
        width={3}
        stroke="stroke-brand-300"
      />

      {HILL_TREES.map((tree) => (
        <g key={tree.x}>
          <Line
            d={`M${tree.x} ${tree.ground}V${tree.ground - tree.size}`}
            delay={tree.delay}
            duration={300}
            width={3}
          />
          <Shape
            d={circle(tree.x, tree.ground - tree.size * 1.35, tree.size * 0.5)}
            fill="fill-brand-300"
            delay={tree.delay + 150}
            duration={450}
            width={3}
          />
        </g>
      ))}

      <Shape
        d={rect(40, 200, 124, 78, 6)}
        fill="fill-white"
        delay={250}
        duration={700}
      />
      <Line
        d="M64 258H140"
        delay={900}
        duration={350}
        width={4}
        stroke="stroke-coral"
      />
      <text
        className="art-fill fill-brand font-display"
        x="102"
        y="244"
        textAnchor="middle"
        fontSize="17"
        fontWeight="700"
        letterSpacing="2.5"
        style={timing(1000)}
      >
        COSMO
      </text>
      <Shape
        d="M168 216H200L222 242V280H168Z"
        fill="fill-brand-300"
        delay={500}
        duration={500}
      />
      <Shape
        d="M176 224H197L212 242H176Z"
        fill="fill-brand-100"
        delay={750}
        duration={350}
        width={2.5}
      />
      <Line
        d="M34 281H226"
        delay={650}
        duration={450}
        width={5}
        stroke="stroke-brand-700"
      />
      {TRUCK_WHEELS.map((x, index) => (
        <g key={x}>
          <Shape
            d={circle(x, 284, 12)}
            fill="fill-white"
            delay={750 + index * 80}
            duration={400}
          />
          <Fill
            d={circle(x, 284, 4.5)}
            className="fill-brand"
            delay={1100 + index * 80}
          />
        </g>
      ))}
      <Line
        d="M10 222H28M4 240H22M14 258H30"
        delay={1050}
        duration={400}
        width={4}
        stroke="stroke-coral"
      />

      {ROUTE_DOTS.map(([x, y], index) => (
        <Pop key={x} delay={1500 + index * 80}>
          <circle className="fill-coral" cx={x} cy={y} r="3.6" />
        </Pop>
      ))}

      <Line d="M468 192.3V100" delay={2300} duration={400} width={4} />
      <Pop delay={2650} origin="left center">
        <path className="fill-coral" d="M468 102H518L506 118L518 134H468Z" />
      </Pop>
    </svg>
  );
}
