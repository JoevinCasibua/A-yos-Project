import { pointFeature, type GeoJsonFeature, type GeoJsonPoint } from '@ayos/contracts';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { Button, EmptyState, Heading, Screen } from '@/components';
import { ServiceMap } from '@/maps';
import { getBookingTracking, recordWorkerLocation, subscribeToBooking } from '@/repository';
import { useSession } from '@/session';

interface TrackingPoint {
  latitude: number;
  longitude: number;
  recorded_at: string;
}

export function TrackingScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const { account } = useSession();
  const [points, setPoints] = useState<TrackingPoint[]>([]);
  const load = useCallback(async () => {
    if (!bookingId) return;
    try {
      setPoints(await getBookingTracking(bookingId));
    } catch (error) {
      Alert.alert(
        'Tracking unavailable',
        error instanceof Error ? error.message : 'Location could not be loaded.',
      );
    }
  }, [bookingId]);
  useEffect(() => {
    void load();
    if (!bookingId) return;
    return subscribeToBooking(
      bookingId,
      () => undefined,
      () => void load(),
    );
  }, [bookingId, load]);

  const features = useMemo<GeoJsonFeature<GeoJsonPoint>[]>(
    () =>
      points.map((point, index) =>
        pointFeature(point, {
          kind: index === 0 ? 'current' : 'history',
          recordedAt: point.recorded_at,
        }),
      ),
    [points],
  );
  const latest = points[0];
  const share = async () => {
    if (!bookingId) return;
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted)
      return Alert.alert(
        'Permission denied',
        'Enable location permission to share active-booking tracking.',
      );
    const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    await recordWorkerLocation(bookingId, {
      latitude: current.coords.latitude,
      longitude: current.coords.longitude,
    });
    await load();
  };
  return (
    <Screen>
      <Heading
        eyebrow="Active booking"
        title="Private service tracking"
        body="Only the customer, assigned worker, and authorized administrators can access these committed location updates."
      />
      {!bookingId ? (
        <EmptyState title="Booking required" body="Open tracking from an active booking." />
      ) : latest ? (
        <ServiceMap
          accessibilityLabel="Active worker tracking map"
          viewport={{ latitude: latest.latitude, longitude: latest.longitude, zoom: 14 }}
          points={features}
          styleUrl={process.env.EXPO_PUBLIC_MAP_STYLE_URL}
        />
      ) : (
        <EmptyState
          title="Waiting for location"
          body="The worker has not shared an active-booking location."
        />
      )}
      {account?.role === 'WORKER' && bookingId ? (
        <Button title="Share current location" onPress={() => void share()} />
      ) : null}
    </Screen>
  );
}
