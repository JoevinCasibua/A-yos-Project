import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import * as Location from 'expo-location';
import { MapPin, Navigation } from 'lucide-react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { AppText } from './AppText';
import AyosMap from './AyosMap';

export interface AddressDetails {
  streetNumber: string;
  street: string;
  district: string; // Barangay
  city: string;
  region: string; // Province
  postalCode: string;
}

interface LocationPickerProps {
  onLocationDetected: (address: AddressDetails, coords: { latitude: number; longitude: number }) => void;
  error?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationDetected, error }) => {
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleUseCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to detect your address.');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const currentCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCoords(currentCoords);

      const reverseGeocode = await Location.reverseGeocodeAsync(currentCoords);

      if (reverseGeocode && reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        
        onLocationDetected({
          streetNumber: address.streetNumber || '',
          street: address.street || '',
          district: address.district || address.subregion || '',
          city: address.city || '',
          region: address.region || '',
          postalCode: address.postalCode || '',
        }, currentCoords);
      } else {
        // Fallback if reverse geocoding fails to give an address
        onLocationDetected({
          streetNumber: '',
          street: '',
          district: '',
          city: '',
          region: '',
          postalCode: '',
        }, currentCoords);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to detect location. Please try again or enter manually.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable 
        style={[styles.button, error ? { borderColor: Colors.error, borderWidth: 1 } : null]} 
        onPress={handleUseCurrentLocation}
        disabled={loading}
      >
        <Navigation size={20} color={loading ? Colors.textTertiary : Colors.white} />
        <AppText 
          variant="body" 
          weight="semiBold" 
          color={loading ? Colors.textTertiary : Colors.white}
          style={styles.buttonText}
        >
          {loading ? 'Detecting Location...' : 'Use Current Location'}
        </AppText>
      </Pressable>
      
      {error && !coords && (
        <AppText variant="caption" color={Colors.error} style={styles.errorText}>
          {error}
        </AppText>
      )}

      {coords && (
        <View style={styles.mapContainer}>
          <AyosMap destination={[coords.longitude, coords.latitude]} interactive={false} />
          <View style={styles.successBadge}>
            <AppText variant="caption" weight="bold" color={Colors.verified}>
              ✓ Location Verified
            </AppText>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing['4'],
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing['4'],
    borderRadius: Radius.lg,
    gap: Spacing['2'],
  },
  buttonText: {
    marginLeft: Spacing['2'],
  },
  mapContainer: {
    marginTop: Spacing['4'],
    height: 150,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  successBadge: {
    position: 'absolute',
    top: Spacing['2'],
    right: Spacing['2'],
    backgroundColor: Colors.verifiedBg,
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['1'],
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.verified,
  },
  errorText: {
    marginTop: Spacing['1'],
  },
});
