import { type GeoPermissibleObjects, geoMercator, geoPath } from "d3-geo";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { StateSlice } from "./data";
import indiaStates from "./india-states.json";

type StatesGeoJson = {
  type: "FeatureCollection";
  features: { type: "Feature"; properties: { name: string }; geometry: GeoJSON.Geometry }[];
};

const WIDTH = 1000;
const HEIGHT = 520;
const INDIA_BBOX: GeoJSON.Polygon = {
  type: "Polygon",
  coordinates: [
    [
      [68, 5],
      [98, 5],
      [98, 38],
      [68, 38],
      [68, 5],
    ],
  ],
};

const STATE_FEATURES = (indiaStates as unknown as StatesGeoJson).features;

function fillFor(high: number): string {
  if (high >= 2) {
    return "fill-destructive/15";
  }
  if (high === 1) {
    return "fill-amber-500/15";
  }
  return "fill-muted";
}

interface IndiaRiskMapProps {
  data: StateSlice[];
  selected: string;
  onSelect: (state: string) => void;
}

export function IndiaRiskMap({ data, selected, onSelect }: IndiaRiskMapProps) {
  const projection = geoMercator();
  projection.fitExtent(
    [
      [72, 72],
      [WIDTH - 72, HEIGHT - 72],
    ],
    INDIA_BBOX as GeoPermissibleObjects,
  );
  const path = geoPath(projection);
  const byState = new Map(data.map((entry) => [entry.state, entry]));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Risk geography</CardTitle>
        <CardDescription>High-flag concentration by state</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-80 overflow-hidden lg:h-[420px]">
          <svg
            aria-label="India risk map by state"
            className="block size-full bg-[#d4dadc] dark:bg-[#2C353C]"
            role="img"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <rect height={HEIGHT} width={WIDTH} className="fill-[#d4dadc] dark:fill-[#2C353C]" />
            {STATE_FEATURES.map((feature) => {
              const name = feature.properties.name;
              const counts = byState.get(name);
              const d = path(feature as GeoPermissibleObjects) ?? undefined;
              if (!counts) {
                return (
                  <path key={name} d={d} className="fill-muted stroke-border" strokeWidth={0.8}>
                    <title>{`${name} · no demo works`}</title>
                  </path>
                );
              }
              const isSelected = selected === name;
              return (
                <a
                  key={name}
                  href={isSelected ? "?" : `?state=${encodeURIComponent(name)}`}
                  onClick={(event) => {
                    event.preventDefault();
                    onSelect(isSelected ? "" : name);
                  }}
                  aria-label={`${name} · ${counts.works} works · ${counts.high} high-risk`}
                >
                  <path
                    d={d}
                    className={`${fillFor(counts.high)} stroke-border ${isSelected ? "stroke-primary" : ""}`}
                    strokeWidth={isSelected ? 2 : 0.8}
                  >
                    <title>{`${name} · ${counts.works} works · ${counts.high} high-risk`}</title>
                  </path>
                </a>
              );
            })}
          </svg>
          <div className="absolute bottom-2 left-2 flex items-center gap-3 rounded-md border bg-card/90 px-2.5 py-1.5 text-muted-foreground text-xs">
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-sm border bg-muted" />
              No flags
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-sm border bg-amber-500/15" />1 flag
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-sm border bg-destructive/15" />
              2+ flags
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
