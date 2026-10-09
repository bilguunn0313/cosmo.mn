import {
  COUNTRY_POSITIONS,
  MONGOLIA_POSITION,
  type CountryCode,
} from "@cosmo/shared";
import { geoNaturalEarth1, geoPath, type GeoProjection } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import atlas from "world-atlas/countries-110m.json";
import type { PublicBrand } from "./public-api";

const MAP_WIDTH = 1000;
const ANTARCTICA_ID = "010";
const LAND_COLOR = "#1d2847";
const BORDER_COLOR = "#2d3a63";

type CountryFeature = Feature<Geometry, { name: string }>;

interface MapGeometry {
  projection: GeoProjection;
  countries: CountryFeature[];
  height: number;
}

let cachedGeometry: MapGeometry | null = null;

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
  const projection = geoNaturalEarth1().fitWidth(MAP_WIDTH, land);
  const [, [, bottom]] = geoPath(projection).bounds(land);

  cachedGeometry = { projection, countries, height: Math.ceil(bottom) };
  return cachedGeometry;
}

function shapePath() {
  return geoPath(getGeometry().projection).digits(1);
}

function findCountryShape(numeric: string) {
  const country = getGeometry().countries.find((item) => item.id === numeric);
  return country ? shapePath()(country) : null;
}

export function getWorldMapSvg() {
  const { countries, height } = getGeometry();
  const path = shapePath();
  const shapes = countries.map((country) => `<path d="${path(country)}"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MAP_WIDTH} ${height}"><g fill="${LAND_COLOR}" stroke="${BORDER_COLOR}" stroke-width="0.6" stroke-linejoin="round">${shapes.join("")}</g></svg>`;
}

export interface MapPoint {
  x: number;
  y: number;
}

export interface MapBrand {
  slug: string;
  name: string;
  logoUrl: string | null;
}

export interface MapOrigin {
  code: CountryCode;
  pin: MapPoint;
  shape: string | null;
  brands: MapBrand[];
}

export interface WorldMapLayout {
  width: number;
  height: number;
  mongolia: { pin: MapPoint; shape: string | null };
  origins: MapOrigin[];
}

function project(position: { lat: number; lng: number }): MapPoint | null {
  const point = getGeometry().projection([position.lng, position.lat]);
  return point ? { x: point[0], y: point[1] } : null;
}

function groupBrandsByCountry(brands: PublicBrand[]) {
  const groups = new Map<CountryCode, MapBrand[]>();

  for (const brand of brands) {
    if (!brand.originCountry) {
      continue;
    }

    const group = groups.get(brand.originCountry) ?? [];
    group.push({ slug: brand.slug, name: brand.name, logoUrl: brand.logoUrl });
    groups.set(brand.originCountry, group);
  }

  return groups;
}

export function buildWorldMapLayout(
  brands: PublicBrand[],
): WorldMapLayout | null {
  const mongoliaPin = project(MONGOLIA_POSITION);

  if (!mongoliaPin) {
    return null;
  }

  const origins = [...groupBrandsByCountry(brands).entries()]
    .flatMap(([code, countryBrands]) => {
      const position = COUNTRY_POSITIONS[code];
      const pin = project(position);

      if (!pin) {
        return [];
      }

      return [
        {
          code,
          pin,
          shape: findCountryShape(position.numeric),
          brands: countryBrands,
        },
      ];
    })
    .sort((a, b) => b.brands.length - a.brands.length);

  return {
    width: MAP_WIDTH,
    height: getGeometry().height,
    mongolia: {
      pin: mongoliaPin,
      shape: findCountryShape(MONGOLIA_POSITION.numeric),
    },
    origins,
  };
}
