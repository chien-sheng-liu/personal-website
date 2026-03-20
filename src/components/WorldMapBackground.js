"use client";
import { useMemo, useEffect, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";

/*
  Rich 2D world map background using real Natural Earth geographic data.
  Rendered via d3-geo projection into SVG paths.

  Layers (bottom → top):
    1. Real country/continent silhouettes (d3-geo + TopoJSON)
    2. Scattered dot pattern (data/connectivity feel)
    3. City glow dots at journey locations
*/

const VB_W = 1100;
const VB_H = 680;

/* ── Projection: NaturalEarth1, centered and scaled to fill viewBox ── */
const projection = geoNaturalEarth1()
  .scale(195)
  .translate([VB_W / 2, VB_H / 2 + 20]);

const pathGenerator = geoPath().projection(projection);

/* Convert [lng, lat] to SVG [x, y] using the same projection */
function project(lng, lat) {
  const p = projection([lng, lat]);
  return p ? { x: p[0], y: p[1] } : { x: 0, y: 0 };
}

/* ── City positions using real coordinates ── */
const CITIES = [
  { name: "Taipei",    lng: 121.56, lat: 25.03, color: "#f59e0b" },
  { name: "Hong Kong", lng: 114.17, lat: 22.32, color: "#f97316" },
  { name: "Shanghai",  lng: 121.47, lat: 31.23, color: "#f59e0b" },
  { name: "Mannheim",  lng: 8.47,   lat: 49.49, color: "#a78bfa" },
  { name: "Berlin",    lng: 13.40,  lat: 52.52, color: "#a78bfa" },
  { name: "Bayreuth",  lng: 11.58,  lat: 49.95, color: "#a78bfa" },
].map((c) => ({ ...c, ...project(c.lng, c.lat) }));

/* ── Map numeric country ID → continent for coloring ── */
const CONTINENT_MAP = {
  // North America
  "124": "americas", "840": "americas", "484": "americas", "192": "americas",
  "332": "americas", "214": "americas", "388": "americas", "044": "americas",
  "630": "americas", "320": "americas", "340": "americas", "222": "americas",
  "558": "americas", "188": "americas", "591": "americas", "076": "americas",
  "170": "americas", "862": "americas", "604": "americas", "152": "americas",
  "032": "americas", "218": "americas", "068": "americas", "600": "americas",
  "858": "americas", "328": "americas", "740": "americas",
  // Europe
  "826": "europe", "250": "europe", "276": "europe", "724": "europe",
  "380": "europe", "620": "europe", "528": "europe", "056": "europe",
  "756": "europe", "040": "europe", "203": "europe", "616": "europe",
  "348": "europe", "642": "europe", "100": "europe", "300": "europe",
  "191": "europe", "070": "europe", "688": "europe", "499": "europe",
  "008": "europe", "807": "europe", "703": "europe", "705": "europe",
  "352": "europe", "578": "europe", "752": "europe", "246": "europe",
  "208": "europe", "372": "europe", "440": "europe", "428": "europe",
  "233": "europe", "804": "europe", "112": "europe", "498": "europe",
  // Africa
  "818": "africa", "434": "africa", "012": "africa", "504": "africa",
  "788": "africa", "732": "africa", "566": "africa", "120": "africa",
  "180": "africa", "834": "africa", "404": "africa", "800": "africa",
  "231": "africa", "706": "africa", "024": "africa", "508": "africa",
  "710": "africa", "716": "africa", "894": "africa", "854": "africa",
  "466": "africa", "562": "africa", "148": "africa", "736": "africa",
  "728": "africa", "678": "africa", "450": "africa", "204": "africa",
  "768": "africa", "288": "africa", "384": "africa", "324": "africa",
  "686": "africa", "270": "africa", "430": "africa", "516": "africa",
  "072": "africa", "426": "africa", "748": "africa",
  // Asia
  "156": "asia", "356": "asia", "392": "asia", "410": "asia",
  "408": "asia", "496": "asia", "643": "asia", "398": "asia",
  "860": "asia", "795": "asia", "792": "asia", "364": "asia",
  "368": "asia", "682": "asia", "887": "asia", "512": "asia",
  "784": "asia", "634": "asia", "414": "asia", "400": "asia",
  "376": "asia", "422": "asia", "760": "asia", "004": "asia",
  "586": "asia", "050": "asia", "144": "asia", "104": "asia",
  "764": "asia", "704": "asia", "418": "asia", "116": "asia",
  "458": "asia", "360": "asia", "608": "asia", "158": "asia",
  "626": "asia", "096": "asia",
  // Oceania
  "036": "oceania", "554": "oceania", "598": "oceania",
  "242": "oceania", "090": "oceania", "548": "oceania",
};

const CONTINENT_COLORS = {
  americas: { fill: "#34d399", opacity: 0.35 },
  europe:   { fill: "#a78bfa", opacity: 0.30 },
  africa:   { fill: "#fb923c", opacity: 0.30 },
  asia:     { fill: "#2dd4bf", opacity: 0.35 },
  oceania:  { fill: "#f472b6", opacity: 0.28 },
  unknown:  { fill: "#94a3b8", opacity: 0.15 },
};

/* ── Seeded pseudo-random for consistent dot placement ── */
function mulberry32(a) {
  return () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── Generate scattered dots placed on land via geographic sampling ── */
function useScatteredDots(count = 55) {
  return useMemo(() => {
    const rand = mulberry32(42);
    // Sample geographic coordinates that tend to fall on land
    const landRegions = [
      { lngMin: -130, lngMax: -60,  latMin: 15,  latMax: 60  }, // N. America
      { lngMin: -80,  lngMax: -35,  latMin: -55, latMax: 10  }, // S. America
      { lngMin: -10,  lngMax: 40,   latMin: 35,  latMax: 65  }, // Europe
      { lngMin: -15,  lngMax: 50,   latMin: -35, latMax: 35  }, // Africa
      { lngMin: 60,   lngMax: 140,  latMin: 10,  latMax: 60  }, // Asia
      { lngMin: 115,  lngMax: 155,  latMin: -40, latMax: -10 }, // Oceania
    ];

    const dots = [];
    for (let i = 0; i < count; i++) {
      const region = landRegions[Math.floor(rand() * landRegions.length)];
      const lng = region.lngMin + rand() * (region.lngMax - region.lngMin);
      const lat = region.latMin + rand() * (region.latMax - region.latMin);
      const { x, y } = project(lng, lat);
      dots.push({
        x, y,
        r: 1 + rand() * 1.5,
        delay: rand() * 5,
        duration: 3 + rand() * 3,
      });
    }
    return dots;
  }, [count]);
}

export default function WorldMapBackground() {
  const [countries, setCountries] = useState([]);
  const dots = useScatteredDots(55);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/data/world-110m.json`)
      .then((r) => r.json())
      .then((topo) => {
        const geo = feature(topo, topo.objects.countries);
        setCountries(geo.features);
      })
      .catch(() => {});
  }, []);

  /* Pre-compute SVG paths */
  const countryPaths = useMemo(() => {
    return countries.map((f, idx) => {
      // Some shapes (e.g., Kosovo) have no numeric id, so ensure a stable fallback key.
      const keyBase =
        f.id ?? f.properties?.name ?? `country-${idx}`;
      const id = f.id;
      const continent = CONTINENT_MAP[String(id)] || "unknown";
      const color = CONTINENT_COLORS[continent];
      return {
        id,
        key: `country-${keyBase}`,
        d: pathGenerator(f),
        fill: color.fill,
        opacity: color.opacity,
      };
    });
  }, [countries]);

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <filter id="wm-cityGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>
        </defs>

        {/* ── Layer 1: Real geographic country paths ── */}
        <g className="animate-[continent-breathe_8s_ease-in-out_infinite]">
          {countryPaths.map((c) => (
            <path
              key={c.key}
              d={c.d}
              fill={c.fill}
              fillOpacity={c.opacity}
              stroke="#94a3b8"
              strokeWidth="0.5"
              strokeOpacity="0.25"
            />
          ))}
        </g>

        {/* ── Layer 2: Scattered data dots ── */}
        <g>
          {dots.map((dot, i) => (
            <circle
              key={`scatter-${i}`}
              cx={dot.x}
              cy={dot.y}
              r={dot.r}
              fill="#34d399"
              opacity="0"
              className="animate-[dot-twinkle_ease-in-out_infinite]"
              style={{
                animationDuration: `${dot.duration}s`,
                animationDelay: `${dot.delay}s`,
              }}
            />
          ))}
        </g>

        {/* ── Layer 3: City glow dots (journey locations) ── */}
        <g>
          {CITIES.map((city, i) => (
            <g key={`city-${i}`}>
              <circle
                cx={city.x}
                cy={city.y}
                r="12"
                fill={city.color}
                opacity="0.15"
                filter="url(#wm-cityGlow)"
              />
              <circle
                cx={city.x}
                cy={city.y}
                r="4"
                fill={city.color}
                opacity="0.3"
                className="animate-[city-pulse_2.5s_ease-out_infinite]"
                style={{
                  animationDelay: `${i * 0.4}s`,
                  transformOrigin: `${city.x}px ${city.y}px`,
                }}
              />
              <circle
                cx={city.x}
                cy={city.y}
                r="2.5"
                fill={city.color}
                opacity="0.6"
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
