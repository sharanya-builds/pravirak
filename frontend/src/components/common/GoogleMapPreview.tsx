import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Check, Edit3, Info } from 'lucide-react';
import { SelectedLocation } from '../../types';
import { PrimaryButton } from './PrimaryButton';
import { useLanguage } from '../../context/LanguageContext';

interface GoogleMapPreviewProps {
  location: SelectedLocation;
  onConfirm: () => void;
  onChangeLocation: () => void;
  onCoordinatesAdjusted?: (lat: number, lng: number) => void;
}

export const GoogleMapPreview: React.FC<GoogleMapPreviewProps> = ({
  location,
  onConfirm,
  onChangeLocation,
  onCoordinatesAdjusted
}) => {
  const { t } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const leafletMarkerRef = useRef<L.Marker | null>(null);
  const [adjustedCoords, setAdjustedCoords] = useState<{ lat: number; lng: number }>({
    lat: location.latitude,
    lng: location.longitude
  });

  // Reverse geocode to update display when coords change via drag/click
  const [adjustedAddress, setAdjustedAddress] = useState<string>(location.address);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    let isMounted = true;

    const initMap = () => {
      if (!mapContainerRef.current) return;

      if (leafletMapRef.current) {
        leafletMapRef.current.setView([location.latitude, location.longitude], 16);
        leafletMarkerRef.current?.setLatLng([location.latitude, location.longitude]);
        setAdjustedCoords({ lat: location.latitude, lng: location.longitude });
        setAdjustedAddress(location.address);
        return;
      }

      const map = L.map(mapContainerRef.current, {
        center: [location.latitude, location.longitude],
        zoom: 16,
        scrollWheelZoom: true,
        zoomControl: true,
      });
      leafletMapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const customPin = L.divIcon({
        className: 'custom-user-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100);">
            <div style="background: #0F1E36; color: white; padding: 5px 10px; border-radius: 8px; font-size: 13px; font-weight: 800; border: 2px solid #F59E0B; box-shadow: 0 4px 8px rgba(0,0,0,0.4); white-space: nowrap;">
              📍 Selected Location
            </div>
            <div style="width: 14px; height: 14px; background: #0F1E36; border: 2px solid #F59E0B; transform: rotate(45deg); margin-top: -7px; border-radius: 2px;"></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const marker = L.marker([location.latitude, location.longitude], {
        icon: customPin,
        draggable: true,
      }).addTo(map);
      leafletMarkerRef.current = marker;

      marker.on('dragend', async (e) => {
        const latlng = e.target.getLatLng();
        if (!isMounted) return;
        setAdjustedCoords({ lat: latlng.lat, lng: latlng.lng });
        onCoordinatesAdjusted?.(latlng.lat, latlng.lng);
        // Reverse geocode
        try {
          const apiBase = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:4000/api';
          const resp = await fetch(`${apiBase}/geocode/reverse?lat=${latlng.lat}&lng=${latlng.lng}`);
          if (resp.ok) {
            const data = await resp.json();
            if (data?.result?.address && isMounted) setAdjustedAddress(data.result.address);
          }
        } catch { /* ignore */ }
      });

      map.on('click', async (e) => {
        if (!isMounted) return;
        marker.setLatLng(e.latlng);
        setAdjustedCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
        onCoordinatesAdjusted?.(e.latlng.lat, e.latlng.lng);
        // Reverse geocode
        try {
          const apiBase = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:4000/api';
          const resp = await fetch(`${apiBase}/geocode/reverse?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
          if (resp.ok) {
            const data = await resp.json();
            if (data?.result?.address && isMounted) setAdjustedAddress(data.result.address);
          }
        } catch { /* ignore */ }
      });

      setTimeout(() => map.invalidateSize(), 200);
    };

    initMap();

    return () => {
      isMounted = false;
    };
  }, [location]);

  // Sync when location prop changes (e.g. user picks different address)
  useEffect(() => {
    setAdjustedCoords({ lat: location.latitude, lng: location.longitude });
    setAdjustedAddress(location.address);
  }, [location.latitude, location.longitude, location.address]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      leafletMapRef.current?.remove();
      leafletMapRef.current = null;
      leafletMarkerRef.current = null;
    };
  }, []);

  return (
    <div className="bg-white dark:bg-[#0D0D0D] rounded-2xl border-2 border-slate-200 dark:border-neutral-800 overflow-hidden shadow-md">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-400" />
          <span className="text-sm sm:text-base font-extrabold tracking-wide">
            {t.locationConfirmation} &amp; {t.mapPreview}
          </span>
        </div>
        <div className="text-xs text-slate-300 font-semibold">
          OpenStreetMap (Live)
        </div>
      </div>

      {/* OSM Notice */}
      <div className="px-4 py-2.5 bg-teal-50 dark:bg-[#031D1A] border-b border-teal-200 dark:border-teal-900 flex items-center gap-2 text-xs text-teal-900 dark:text-teal-200">
        <Info className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 shrink-0" />
        <span className="font-semibold">{t.dragPinHint}</span>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full h-[300px] sm:h-[380px] bg-slate-100 dark:bg-black">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Address Details & Action Buttons Below Map */}
      <div className="p-4 sm:p-6 bg-slate-50 dark:bg-[#0A0A0A] border-t border-slate-200 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-neutral-400 block">
              {t.confirmedAddress}
            </span>
            <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-0.5 leading-snug">
              {adjustedAddress}
            </h4>
            <div className="text-sm text-slate-600 dark:text-neutral-300 mt-1 flex flex-wrap items-center gap-2 font-medium">
              <span>{t.cityLabel}: <strong className="text-slate-800 dark:text-white font-extrabold">{location.city}</strong></span>
              <span>•</span>
              <span>{t.stateLabel}: <strong className="text-slate-800 dark:text-white font-extrabold">{location.state}</strong></span>
              {location.postalCode && <>
                <span>•</span>
                <span className="font-mono font-bold text-slate-700 dark:text-neutral-200">{location.postalCode}</span>
              </>}
              <span>•</span>
              <span className="font-mono text-xs text-slate-500 dark:text-neutral-400">{adjustedCoords.lat.toFixed(5)}°N, {adjustedCoords.lng.toFixed(5)}°E</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onChangeLocation}
              className="flex-1 sm:flex-initial px-4 py-3 text-sm font-bold text-slate-700 dark:text-white bg-white dark:bg-[#1A1A1A] border-2 border-slate-300 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-[#262626] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-slate-500 dark:text-neutral-400" />
              <span>{t.changeLocation}</span>
            </button>

            <PrimaryButton
              type="button"
              onClick={onConfirm}
              variant="primary"
              size="md"
              icon={<Check className="w-4 h-4" />}
              className="flex-1 sm:flex-initial"
            >
              {t.useThisLocation}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};
