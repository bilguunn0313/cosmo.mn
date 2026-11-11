import { getTranslations } from "next-intl/server";

const CITY = { x: 330, y: 200 };

const REGIONS = [
  { key: "west", x: 80, y: 140, route: "M330 200 Q200 110 80 140", delay: 500 },
  { key: "khangai", x: 180, y: 300, route: "M330 200 Q260 280 180 300", delay: 650 },
  { key: "central", x: 370, y: 345, route: "M330 200 Q390 280 370 345", delay: 800 },
  { key: "east", x: 490, y: 165, route: "M330 200 Q420 140 490 165", delay: 950 },
] as const;

function hubDelay(delay: number) {
  return { "--hub-delay": `${delay}ms` } as React.CSSProperties;
}

export async function NetworkMap() {
  const t = await getTranslations("about.network.map");

  return (
    <figure className="flex flex-col gap-4 rounded-3xl bg-brand-100/60 p-6">
      <svg
        viewBox="0 0 560 420"
        role="img"
        aria-label={t("label")}
        className="block h-auto w-full"
      >
        <defs>
          <pattern
            id="network-dots"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.2" className="fill-brand-300/70" />
          </pattern>
        </defs>
        <rect width="560" height="420" fill="url(#network-dots)" />

        <g
          fill="none"
          strokeWidth="2"
          strokeDasharray="6 8"
          strokeLinecap="round"
          className="stroke-brand/55"
        >
          {REGIONS.map((region) => (
            <path key={region.key} d={region.route} className="network-route" />
          ))}
        </g>

        {REGIONS.map((region) => (
          <g key={region.key} className="network-hub" style={hubDelay(region.delay)}>
            <circle cx={region.x} cy={region.y} r="11" className="fill-brand/25" />
            <circle
              cx={region.x}
              cy={region.y}
              r="7"
              strokeWidth="3"
              className="fill-white stroke-brand"
            />
            <text
              x={region.x}
              y={region.y + 34}
              textAnchor="middle"
              className="fill-ink font-sans text-[14px] font-medium"
            >
              {t(region.key)}
            </text>
          </g>
        ))}

        <g className="network-hub" style={hubDelay(150)}>
          <circle cx={CITY.x} cy={CITY.y} r="22" className="fill-coral/30" />
          <circle cx={CITY.x} cy={CITY.y} r="15" className="fill-brand" />
          <circle cx={CITY.x} cy={CITY.y} r="5" className="fill-white" />
          <text
            x={CITY.x}
            y={CITY.y + 44}
            textAnchor="middle"
            className="fill-ink font-display text-[17px] font-semibold"
          >
            {t("city")}
          </text>
          <text
            x={CITY.x}
            y={CITY.y + 62}
            textAnchor="middle"
            className="fill-ink-2 font-sans text-[13px]"
          >
            {t("hub")}
          </text>
        </g>
      </svg>

      <figcaption className="flex flex-wrap gap-5 text-sm text-ink-2">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="size-3.5 rounded-full bg-brand" />
          {t("hub")}
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="size-3.5 rounded-full border-3 border-brand bg-white"
          />
          {t("regional")}
        </span>
      </figcaption>
    </figure>
  );
}
