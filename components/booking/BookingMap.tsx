import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MapPin, Navigation } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';

interface BookingMapProps {
  destinationLat: number;
  destinationLng: number;
  destinationAddress: string;
  workerLat?: number;
  workerLng?: number;
}

export const BookingMap = React.memo(function BookingMap({
  destinationLat,
  destinationLng,
  destinationAddress,
  workerLat,
  workerLng,
}: BookingMapProps) {
  const currentLat = workerLat ?? destinationLat + 0.01;
  const currentLng = workerLng ?? destinationLng - 0.01;

  const region = {
    latitude: (currentLat + destinationLat) / 2,
    longitude: (currentLng + destinationLng) / 2,
    latitudeDelta: Math.abs(currentLat - destinationLat) * 2 + 0.02,
    longitudeDelta: Math.abs(currentLng - destinationLng) * 2 + 0.02,
  };

  return (
    <View style={styles.container}>
      {Platform.OS !== 'web' ? (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          showsUserLocation={false}
          scrollEnabled
          zoomEnabled
        >
          {/* Worker marker */}
          <Marker coordinate={{ latitude: currentLat, longitude: currentLng }} title="You">
            <View style={styles.workerMarker}>
              <Navigation size={16} color={Colors.white} />
            </View>
          </Marker>

          {/* Destination marker */}
          <Marker
            coordinate={{ latitude: destinationLat, longitude: destinationLng }}
            title={destinationAddress}
            description="Customer location"
          >
            <View style={styles.destinationMarker}>
              <MapPin size={20} color={Colors.error} fill={Colors.white} />
            </View>
          </Marker>
        </MapView>
      ) : (
        <View style={[styles.map, styles.fallbackMap]}>
          <MapPin size={32} color={Colors.error} />
          <AppText variant="caption" color={Colors.textSecondary} style={styles.fallbackText}>
            Map Preview (Native Only)
          </AppText>
          <AppText variant="body" weight="semiBold">{destinationAddress}</AppText>
        </View>
      )}

      <View style={styles.etaBadge}>
        <AppText variant="h4" color={Colors.cta}>15 Min</AppText>
        <AppText variant="caption" color={Colors.textSecondary}>ETA</AppText>
      </View>

      <View style={styles.addressBadge}>
        <MapPin size={14} color={Colors.error} />
        <AppText variant="caption" color={Colors.textPrimary} style={styles.addressText}>
          {destinationAddress}
        </AppText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    height: 220,
    position: 'relative',
    ...Elevation.sm,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  fallbackMap: {
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing['1'],
  },
  fallbackText: {
    marginBottom: Spacing['2'],
  },
  workerMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.cta,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  destinationMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  etaBadge: {
    position: 'absolute',
    top: Spacing['2'],
    right: Spacing['2'],
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['1'],
    borderRadius: Radius.lg,
    alignItems: 'center',
    ...Elevation.sm,
  },
  addressBadge: {
    position: 'absolute',
    bottom: Spacing['2'],
    left: Spacing['2'],
    right: Spacing['2'],
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: Spacing['2'],
    paddingVertical: Spacing['1'],
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addressText: {
    flex: 1,
  },
});
