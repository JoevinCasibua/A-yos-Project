import type {
  GeoJsonFeature,
  GeoJsonLineString,
  GeoJsonPoint,
  MapViewportState,
} from '@ayos/contracts';

export interface ServiceMapProps {
  viewport: MapViewportState;
  points: GeoJsonFeature<GeoJsonPoint>[];
  route?: GeoJsonFeature<GeoJsonLineString>;
  styleUrl?: string | undefined;
  accessibilityLabel?: string;
}
