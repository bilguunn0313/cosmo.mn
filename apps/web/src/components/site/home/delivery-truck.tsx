const WHEELS = [640, 702, 812];

export function DeliveryTruck() {
  return (
    <g className="supply-truck">
      <rect
        className="fill-white stroke-brand"
        x="600"
        y="214"
        width="168"
        height="104"
        rx="6"
        strokeWidth="3"
      />
      <rect
        className="fill-brand-100"
        x="603"
        y="288"
        width="162"
        height="10"
      />
      <text
        className="fill-brand font-display"
        x="684"
        y="262"
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        letterSpacing="3"
      >
        COSMO
      </text>
      <rect
        className="fill-coral"
        x="636"
        y="274"
        width="96"
        height="4"
        rx="2"
      />
      <path className="fill-brand" d="M772 236 H818 L846 270 V318 H772 Z" />
      <path className="fill-brand-100" d="M784 246 H814 L834 270 H784 Z" />
      <rect
        className="fill-brand-700"
        x="840"
        y="304"
        width="12"
        height="12"
        rx="3"
      />
      <rect
        className="fill-brand-700"
        x="596"
        y="316"
        width="256"
        height="8"
        rx="4"
      />
      {WHEELS.map((x) => (
        <g key={x}>
          <circle className="fill-brand-700" cx={x} cy="328" r="16" />
          <circle className="fill-brand-300" cx={x} cy="328" r="7" />
          <g className="supply-hub" style={{ transformOrigin: `${x}px 328px` }}>
            <rect
              className="fill-brand-400"
              x={x - 1.5}
              y="314"
              width="3"
              height="6"
              rx="1.5"
            />
            <rect
              className="fill-brand-400"
              x={x - 1.5}
              y="336"
              width="3"
              height="6"
              rx="1.5"
            />
          </g>
        </g>
      ))}
    </g>
  );
}
