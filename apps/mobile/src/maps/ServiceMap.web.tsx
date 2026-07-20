import maplibregl, { type Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { colors } from '@/theme';
import type { ServiceMapProps } from './ServiceMap.types';

export function ServiceMap({
  viewport,
  points,
  route,
  styleUrl,
  accessibilityLabel,
}: ServiceMapProps) {
  const container = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapLibreMap | null>(null);
  useEffect(() => {
    if (!container.current || !styleUrl) return;
    const next = new maplibregl.Map({
      container: container.current,
      style: styleUrl,
      center: [viewport.longitude, viewport.latitude],
      zoom: viewport.zoom,
    });
    map.current = next;
    next.addControl(new maplibregl.NavigationControl(), 'top-right');
    next.on('load', () => {
      next.addSource('service-points', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: points },
      });
      next.addLayer({
        id: 'service-points-layer',
        type: 'circle',
        source: 'service-points',
        paint: {
          'circle-radius': 7,
          'circle-color': colors.accent,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2,
        },
      });
      if (route) {
        next.addSource('service-route', { type: 'geojson', data: route });
        next.addLayer({
          id: 'service-route-layer',
          type: 'line',
          source: 'service-route',
          paint: { 'line-color': colors.warning, 'line-width': 5, 'line-opacity': 0.9 },
        });
      }
    });
    return () => {
      map.current = null;
      next.remove();
    };
  }, [styleUrl, points, route, viewport.latitude, viewport.longitude, viewport.zoom]);
  if (!styleUrl)
    return (
      <View
        style={{
          height: 220,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 14,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <Text style={{ color: colors.muted, textAlign: 'center' }}>
          Map tiles are unavailable until a public style URL is configured.
        </Text>
      </View>
    );
  return (
    <div
      ref={container}
      role="img"
      aria-label={accessibilityLabel ?? 'Service map'}
      style={{ height: 360, width: '100%', borderRadius: 14, overflow: 'hidden' }}
    />
  );
}
