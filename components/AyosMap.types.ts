export interface AyosMapProps {
  origin?: [number, number] | null;
  destination?: [number, number] | null;
  route?: { type: 'LineString'; coordinates: [number, number][] } | null;
  interactive?: boolean;
}

