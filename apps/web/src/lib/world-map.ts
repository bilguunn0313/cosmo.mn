import {
  COUNTRY_POSITIONS,
  MONGOLIA_POSITION,
  type CountryCode,
} from "@cosmo/shared";
import {
  geoContains,
  geoNaturalEarth1,
  geoPath,
  type GeoProjection,
} from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import atlas from "world-atlas/countries-110m.json";

const MAP_WIDTH = 1200;
const MAP_ROTATION: [number, number] = [-20, 0];
const NORTH_EDGE = 78;
const SOUTH_EDGE = -48;
const DOT_STEP = 7;
const LAND_DOT_RADIUS = 2.1;
const HIGHLIGHT_DOT_RADIUS = 2.3;
const ANTARCTICA_ID = "010";
const LAND_DOT_COLOR = "#84abce";
const LAND_DOT_OPACITY = 0.45;

type CountryFeature = Feature<Geometry, { name: string }>;

export interface MapPoint {
  x: number;
  y: number;
}

interface MapGeometry {
  projection: GeoProjection;
  countries: CountryFeature[];
  height: number;
}

let cachedGeometry: MapGeometry | null = null;
let cachedDots: Map<string, MapPoint[]> | null = null;

function getGeometry(): MapGeometry {
  if (cachedGeometry) {
    return cachedGeometry;
  }

  const topology = atlas as unknown as Topology<{
    countries: GeometryCollection<{ name: string }>;
  }>;
  const collection = feature(
    topology,
    topology.objects.countries,
  ) as FeatureCollection<Geometry, { name: string }>;
  const countries = collection.features.filter(
    (country) => country.id !== ANTARCTICA_ID,
  );
  const land: FeatureCollection = {
    type: "FeatureCollection",
    features: countries,
  };
  const projection = geoNaturalEarth1()
    .rotate(MAP_ROTATION)
    .fitWidth(MAP_WIDTH, land);
  const top = projection([0, NORTH_EDGE])?.[1] ?? 0;
  const bottom = projection([0, SOUTH_EDGE])?.[1] ?? 0;
  const [translateX, translateY] = projection.translate();

  projection.translate([translateX, translateY - top]);
  cachedGeometry = {
    projection,
    countries,
    height: Math.round(bottom - top),
  };
  return cachedGeometry;
}

function gridStart(edge: number) {
  const half = DOT_STEP / 2;
  return half + Math.max(0, Math.ceil((edge - half) / DOT_STEP)) * DOT_STEP;
}

function getCountryDots() {
  if (cachedDots) {
    return cachedDots;
  }

  const { projection, countries, height } = getGeometry();
  const bounds = geoPath(projection);
  const taken = new Set<string>();
  cachedDots = new Map();

  for (const country of countries) {
    const [[left, top], [right, bottom]] = bounds.bounds(country);
    const dots: MapPoint[] = [];

    for (let y = gridStart(top); y <= Math.min(bottom, height); y += DOT_STEP) {
      for (
        let x = gridStart(left);
        x <= Math.min(right, MAP_WIDTH);
        x += DOT_STEP
      ) {
        const key = `${x}:${y}`;
        const position = projection.invert?.([x, y]);

        if (taken.has(key) || !position || !geoContains(country, position)) {
          continue;
        }

        taken.add(key);
        dots.push({ x, y });
      }
    }

    cachedDots.set(String(country.id), dots);
  }

  return cachedDots;
}

function dotsPath(dots: MapPoint[], radius: number) {
  return dots
    .map(
      ({ x, y }) =>
        `M${x - radius} ${y}a${radius} ${radius} 0 1 0 ${radius * 2} 0a${radius} ${radius} 0 1 0 ${-radius * 2} 0`,
    )
    .join("");
}

export function getWorldMapSvg() {
  const { height } = getGeometry();
  const dots = [...getCountryDots().values()].flat();

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MAP_WIDTH} ${height}"><path fill="${LAND_DOT_COLOR}" fill-opacity="${LAND_DOT_OPACITY}" d="${dotsPath(dots, LAND_DOT_RADIUS)}"/></svg>`;
}

export interface MapOrigin {
  code: CountryCode;
  pin: MapPoint;
  dots: string;
}

export interface WorldMapLayout {
  width: number;
  height: number;
  mongolia: { pin: MapPoint; dots: string };
  origins: MapOrigin[];
}

function project(position: { lat: number; lng: number }): MapPoint | null {
  const point = getGeometry().projection([position.lng, position.lat]);
  return point
    ? { x: Math.round(point[0] * 10) / 10, y: Math.round(point[1] * 10) / 10 }
    : null;
}

function countryDots(numeric: string) {
  return dotsPath(getCountryDots().get(numeric) ?? [], HIGHLIGHT_DOT_RADIUS);
}

export function buildWorldMapLayout(
  countries: CountryCode[],
): WorldMapLayout | null {
  const mongoliaPin = project(MONGOLIA_POSITION);

  if (!mongoliaPin) {
    return null;
  }

  const origins = countries.flatMap((code) => {
    const position = COUNTRY_POSITIONS[code];
    const pin = project(position);

    if (!pin) {
      return [];
    }

    return [{ code, pin, dots: countryDots(position.numeric) }];
  });

  return {
    width: MAP_WIDTH,
    height: getGeometry().height,
    mongolia: {
      pin: mongoliaPin,
      dots: countryDots(MONGOLIA_POSITION.numeric),
    },
    origins,
  };
}
