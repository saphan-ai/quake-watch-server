// The five regions and their latitude/longitude boxes.
// Copied from the table in `info.description` of docs/api/openapi.yaml; the contract wins if they differ.
export interface Box {
  minLat: number
  maxLat: number
  minLon: number
  maxLon: number
}

export const regions = {
  'southeast-asia': { minLat: -11, maxLat: 28, minLon: 92, maxLon: 141 },
  japan: { minLat: 24, maxLat: 46, minLon: 122, maxLon: 146 },
  'western-north-america': { minLat: 30, maxLat: 60, minLon: -170, maxLon: -115 },
  mediterranean: { minLat: 30, maxLat: 46, minLon: -6, maxLon: 37 },
  'south-america': { minLat: -56, maxLat: 13, minLon: -82, maxLon: -34 },
} as const satisfies Record<string, Box>

export type Region = keyof typeof regions

export function isRegion(value: string): value is Region {
  return Object.hasOwn(regions, value)
}
