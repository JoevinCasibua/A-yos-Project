import { Camera, GeoJSONSource, Layer, Map } from '@maplibre/maplibre-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';
import type { ServiceMapProps } from './ServiceMap.types';

export function ServiceMap({
  viewport,
  points,
  route,
  styleUrl,
  accessibilityLabel,
}: ServiceMapProps) {
  if (!styleUrl) return <Unavailable />;
  return (
    <View style={styles.container} accessibilityLabel={accessibilityLabel}>
      <Map mapStyle={styleUrl} style={styles.map}>
        <Camera
          initialViewState={{
            center: [viewport.longitude, viewport.latitude],
            zoom: viewport.zoom,
          }}
        />
        <GeoJSONSource id="service-points" data={{ type: 'FeatureCollection', features: points }}>
          <Layer
            id="service-points-layer"
            type="circle"
            paint={{
              'circle-radius': 7,
              'circle-color': colors.accent,
              'circle-stroke-color': '#ffffff',
              'circle-stroke-width': 2,
            }}
          />
        </GeoJSONSource>
        {route ? (
          <GeoJSONSource id="service-route" data={route}>
            <Layer
              id="service-route-layer"
              type="line"
              paint={{ 'line-color': colors.warning, 'line-width': 5, 'line-opacity': 0.9 }}
            />
          </GeoJSONSource>
        ) : null}
      </Map>
    </View>
  );
}

function Unavailable() {
  return (
    <View style={styles.unavailable}>
      <Text style={styles.text}>
        Map tiles are unavailable until a public style URL is configured.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { height: 360, overflow: 'hidden', borderRadius: 14 },
  map: { flex: 1 },
  unavailable: {
    height: 220,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  text: { color: colors.muted, textAlign: 'center' },
});
