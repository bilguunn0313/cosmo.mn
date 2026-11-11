import type { BrandCategory } from "@cosmo/shared";

const PETAL_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

interface ShelfItemProps {
  index: number;
  children: React.ReactNode;
}

function ShelfItem({ index, children }: ShelfItemProps) {
  return (
    <g
      className="shelf-item"
      style={{ "--item": index } as React.CSSProperties}
    >
      {children}
    </g>
  );
}

function FoodItems() {
  return (
    <>
      <ShelfItem index={0}>
        <path className="fill-coral" d="M62 126 L66 94 H82 L86 126 Z" />
        <rect
          className="fill-brand-700"
          x="63"
          y="72"
          width="22"
          height="24"
          rx="4"
        />
        <rect
          className="fill-coral"
          x="44"
          y="122"
          width="60"
          height="164"
          rx="22"
        />
        <rect className="fill-white" x="44" y="182" width="60" height="56" />
        <rect
          className="fill-brand"
          x="56"
          y="198"
          width="36"
          height="6"
          rx="3"
        />
        <rect
          className="fill-brand-300"
          x="56"
          y="212"
          width="24"
          height="6"
          rx="3"
        />
      </ShelfItem>
      <ShelfItem index={1}>
        <rect
          className="fill-amber"
          x="122"
          y="156"
          width="76"
          height="130"
          rx="8"
        />
        <ellipse className="fill-brand-300" cx="160" cy="157" rx="38" ry="7" />
        <rect className="fill-white" x="122" y="184" width="76" height="72" />
        <circle className="fill-coral" cx="160" cy="222" r="20" />
        <path className="fill-brand" d="M160 202 q9 -11 20 -6 q-7 11 -20 6z" />
      </ShelfItem>
      <ShelfItem index={2}>
        <rect
          className="fill-brand"
          x="222"
          y="166"
          width="72"
          height="22"
          rx="5"
        />
        <rect
          className="fill-brand-200"
          x="216"
          y="184"
          width="84"
          height="102"
          rx="18"
        />
        <circle className="fill-brand-400" cx="238" cy="208" r="9" />
        <circle className="fill-brand-700" cx="259" cy="203" r="9" />
        <circle className="fill-brand-400" cx="280" cy="210" r="9" />
        <circle className="fill-brand-700" cx="246" cy="227" r="9" />
        <circle className="fill-brand-400" cx="270" cy="228" r="9" />
        <rect className="fill-white" x="216" y="244" width="84" height="26" />
        <rect
          className="fill-brand-300"
          x="236"
          y="254"
          width="44"
          height="6"
          rx="3"
        />
      </ShelfItem>
      <ShelfItem index={3}>
        <path className="fill-brand" d="M322 148 H390 L395 286 H317 Z" />
        <rect
          className="fill-brand-700"
          x="322"
          y="148"
          width="68"
          height="11"
        />
        <ellipse className="fill-ivory" cx="356" cy="220" rx="22" ry="28" />
        <ellipse className="fill-amber" cx="348" cy="210" rx="7" ry="5" />
        <ellipse className="fill-coral" cx="363" cy="218" rx="7" ry="5" />
        <ellipse className="fill-amber" cx="350" cy="230" rx="7" ry="5" />
        <ellipse className="fill-amber" cx="364" cy="236" rx="6" ry="4" />
        <rect
          className="fill-amber"
          x="334"
          y="262"
          width="44"
          height="6"
          rx="3"
        />
      </ShelfItem>
      <ShelfItem index={4}>
        <g transform="rotate(-9 428 286)">
          <rect
            className="fill-brand-700"
            x="406"
            y="174"
            width="44"
            height="112"
            rx="4"
          />
          <rect className="fill-coral" x="406" y="212" width="44" height="34" />
          <rect
            className="fill-brand-200"
            x="406"
            y="174"
            width="44"
            height="16"
            rx="4"
          />
        </g>
      </ShelfItem>
      <ShelfItem index={5}>
        <rect
          className="fill-brand-400"
          x="460"
          y="218"
          width="52"
          height="32"
          rx="6"
        />
        <rect className="fill-white" x="460" y="227" width="52" height="13" />
        <rect
          className="fill-coral"
          x="456"
          y="252"
          width="56"
          height="34"
          rx="6"
        />
        <rect className="fill-white" x="456" y="262" width="56" height="14" />
      </ShelfItem>
    </>
  );
}

function BeautyItems() {
  return (
    <>
      <ShelfItem index={0}>
        <rect
          className="fill-brand-200"
          x="40"
          y="148"
          width="64"
          height="138"
          rx="16"
        />
        <rect className="fill-brand" x="62" y="128" width="20" height="24" />
        <rect className="fill-brand" x="68" y="102" width="8" height="30" />
        <rect
          className="fill-brand"
          x="56"
          y="94"
          width="46"
          height="13"
          rx="6.5"
        />
        <rect
          className="fill-white"
          x="52"
          y="194"
          width="40"
          height="52"
          rx="8"
        />
        <circle className="fill-brand-300" cx="66" cy="214" r="6" />
        <circle className="fill-brand-300" cx="79" cy="227" r="4" />
      </ShelfItem>
      <ShelfItem index={1}>
        <rect
          className="fill-brand-400"
          x="118"
          y="214"
          width="124"
          height="72"
          rx="18"
        />
        <ellipse className="fill-brand-100" cx="180" cy="234" rx="34" ry="10" />
        <path className="fill-white" d="M166 234 q14 -22 28 0 z" />
        <rect
          className="fill-white"
          x="138"
          y="258"
          width="50"
          height="6"
          rx="3"
        />
      </ShelfItem>
      <ShelfItem index={2}>
        <rect
          className="fill-brand-300"
          x="258"
          y="150"
          width="84"
          height="136"
          rx="20"
        />
        {PETAL_ANGLES.map((angle) => (
          <ellipse
            key={angle}
            className="fill-white"
            cx="300"
            cy="192"
            rx="6"
            ry="12"
            transform={`rotate(${angle} 300 206)`}
          />
        ))}
        <circle className="fill-amber" cx="300" cy="206" r="8" />
        <rect
          className="fill-brand"
          x="276"
          y="250"
          width="48"
          height="6"
          rx="3"
        />
      </ShelfItem>
      <ShelfItem index={3}>
        <rect
          className="fill-brand-200"
          x="360"
          y="142"
          width="50"
          height="10"
          rx="2"
        />
        <path className="fill-white" d="M362 150 H408 L398 262 H372 Z" />
        <path className="fill-coral" d="M365 186 H405 L403 210 H367 Z" />
        <rect
          className="fill-coral"
          x="374"
          y="262"
          width="22"
          height="24"
          rx="4"
        />
      </ShelfItem>
      <ShelfItem index={4}>
        <g transform="rotate(10 470 250)">
          <rect
            className="fill-coral"
            x="462"
            y="130"
            width="10"
            height="126"
            rx="5"
          />
          <rect
            className="fill-white"
            x="458"
            y="112"
            width="18"
            height="24"
            rx="3"
          />
        </g>
        <g transform="rotate(-8 486 250)">
          <rect
            className="fill-brand"
            x="482"
            y="140"
            width="10"
            height="116"
            rx="5"
          />
          <rect
            className="fill-white"
            x="478"
            y="122"
            width="18"
            height="24"
            rx="3"
          />
        </g>
        <path className="fill-amber" d="M436 206 H506 L499 286 H443 Z" />
      </ShelfItem>
    </>
  );
}

function HouseholdItems() {
  return (
    <>
      <ShelfItem index={0}>
        <path
          className="fill-brand-400"
          d="M50 170 Q50 150 70 150 H94 Q112 150 112 170 V286 H50 Z"
        />
        <rect
          className="fill-brand-700"
          x="68"
          y="128"
          width="26"
          height="24"
        />
        <path
          className="fill-brand"
          d="M56 96 H112 Q120 96 120 106 V118 H96 V132 H66 V118 Q56 118 56 108 Z"
        />
        <path
          className="stroke-brand"
          d="M72 134 q-8 14 4 24"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <circle className="fill-brand-300" cx="132" cy="104" r="3" />
        <circle className="fill-brand-300" cx="142" cy="96" r="2.5" />
        <circle className="fill-brand-300" cx="144" cy="112" r="2.5" />
        <circle className="fill-brand-300" cx="154" cy="104" r="2" />
        <rect
          className="fill-white"
          x="60"
          y="198"
          width="42"
          height="52"
          rx="8"
        />
      </ShelfItem>
      <ShelfItem index={1}>
        <rect
          className="fill-brand"
          x="170"
          y="176"
          width="92"
          height="110"
          rx="6"
        />
        <rect
          className="fill-brand-700"
          x="170"
          y="176"
          width="92"
          height="18"
          rx="6"
        />
        <circle className="fill-white" cx="216" cy="240" r="26" />
        <circle className="fill-brand-300" cx="208" cy="234" r="8" />
        <circle className="fill-brand-300" cx="224" cy="246" r="6" />
      </ShelfItem>
      <ShelfItem index={2}>
        <rect
          className="fill-coral"
          x="298"
          y="112"
          width="22"
          height="26"
          rx="4"
        />
        <path
          className="fill-amber"
          d="M286 152 Q286 136 302 136 H316 Q332 136 332 152 V286 H286 Z"
        />
        <rect
          className="fill-white"
          x="294"
          y="196"
          width="30"
          height="56"
          rx="6"
        />
        <path
          className="fill-brand-400"
          d="M309 208 q9 13 0 20 q-9 -7 0 -20z"
        />
      </ShelfItem>
      <ShelfItem index={3}>
        <rect
          className="fill-brand"
          x="366"
          y="118"
          width="26"
          height="24"
          rx="4"
        />
        <path
          className="fill-brand-200"
          d="M356 160 Q356 140 376 140 H430 Q450 140 450 160 V286 H356 Z"
        />
        <rect
          className="fill-brand-100"
          x="406"
          y="154"
          width="28"
          height="26"
          rx="8"
        />
        <rect
          className="fill-white"
          x="370"
          y="204"
          width="66"
          height="54"
          rx="8"
        />
        <rect
          className="fill-brand-400"
          x="382"
          y="222"
          width="42"
          height="6"
          rx="3"
        />
      </ShelfItem>
      <ShelfItem index={4}>
        <circle
          className="stroke-brand-300"
          cx="474"
          cy="236"
          r="9"
          fill="none"
          strokeWidth="3"
        />
        <circle
          className="stroke-brand-300"
          cx="497"
          cy="222"
          r="6"
          fill="none"
          strokeWidth="3"
        />
        <circle
          className="stroke-brand-300"
          cx="504"
          cy="243"
          r="4"
          fill="none"
          strokeWidth="3"
        />
        <rect
          className="fill-white stroke-brand-300"
          x="462"
          y="256"
          width="54"
          height="30"
          rx="10"
          strokeWidth="3"
        />
      </ShelfItem>
    </>
  );
}

const SHELF_ITEMS: Record<BrandCategory, React.ReactNode> = {
  FOOD: <FoodItems />,
  BEAUTY: <BeautyItems />,
  HOUSEHOLD: <HouseholdItems />,
};

interface CategoryIllustrationProps {
  category: BrandCategory;
  label: string;
}

export function CategoryIllustration({
  category,
  label,
}: CategoryIllustrationProps) {
  return (
    <svg
      viewBox="0 0 520 310"
      role="img"
      aria-label={label}
      className="block h-auto w-full overflow-visible"
    >
      {SHELF_ITEMS[category]}
      <rect
        className="fill-brand"
        x="0"
        y="284"
        width="520"
        height="16"
        rx="4"
      />
      <rect
        className="fill-brand-700"
        x="14"
        y="300"
        width="492"
        height="7"
        rx="3.5"
        opacity=".18"
      />
    </svg>
  );
}
