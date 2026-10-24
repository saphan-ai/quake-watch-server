// One earthquake, as the contract's `Quake` schema defines it (docs/api/openapi.yaml).
export interface Quake {
  id: string // the USGS event id
  time: string // when it happened, RFC 3339, UTC
  magnitude: number
  depthKm: number
  lat: number
  lon: number
  place: string
}
