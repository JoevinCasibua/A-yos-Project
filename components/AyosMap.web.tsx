import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import maplibregl, { type Map as MapInstance } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { AyosMapProps } from './AyosMap.types';

const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';
export default function AyosMap({ origin, destination, route, interactive = true }: AyosMapProps) {
  const container = useRef<HTMLDivElement | null>(null); const map = useRef<MapInstance | null>(null);
  useEffect(() => {
    if (!container.current) return;
    const center = destination || origin || [121.0244,14.5547];
    const instance = new maplibregl.Map({ container: container.current, style: STYLE_URL, center, zoom: route ? 12 : 15, interactive, attributionControl: {} });
    map.current = instance;
    instance.on('load',()=>{
      if (route) { instance.addSource('route',{type:'geojson',data:{type:'Feature',properties:{},geometry:route}}); instance.addLayer({id:'route-line',type:'line',source:'route',paint:{'line-color':'#1B5E20','line-width':5}}); }
      if (origin) new maplibregl.Marker({color:'#1B5E20'}).setLngLat(origin).addTo(instance);
      if (destination) new maplibregl.Marker({color:'#D32F2F'}).setLngLat(destination).addTo(instance);
    });
    return()=>{instance.remove();map.current=null;};
  },[destination?.[0],destination?.[1],interactive,origin?.[0],origin?.[1],route]);
  return <View style={{flex:1}}><div ref={container} style={{position:'absolute',inset:0}} /></View>;
}
