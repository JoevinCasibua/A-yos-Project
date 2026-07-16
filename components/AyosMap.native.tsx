import React from 'react';
import { Camera, GeoJSONSource, Layer, Map, Marker } from '@maplibre/maplibre-react-native';
import { View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import type { AyosMapProps } from './AyosMap.types';

const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';
export default function AyosMap({ origin, destination, route, interactive = true }: AyosMapProps) {
  const center = destination || origin || [121.0244, 14.5547];
  return <Map mapStyle={STYLE_URL} style={{ flex: 1 }} dragPan={interactive} touchZoom={interactive} doubleTapZoom={interactive} attribution>
    <Camera initialViewState={{ center, zoom: route ? 12 : 15 }} />
    {route && <GeoJSONSource id="route" data={{ type:'Feature', properties:{}, geometry: route }}><Layer id="route-line" type="line" style={{ lineColor: Colors.primary, lineWidth: 5, lineCap: 'round', lineJoin: 'round' }} /></GeoJSONSource>}
    {origin && <Marker id="origin" lngLat={origin}><View><MapPin size={30} color={Colors.primary}/></View></Marker>}
    {destination && <Marker id="destination" lngLat={destination}><View><MapPin size={30} color={Colors.error}/></View></Marker>}
  </Map>;
}
