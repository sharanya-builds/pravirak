import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Store, 
  Users, 
  Navigation, 
  Layers, 
  Info, 
  Building2, 
  ShoppingBag,
  Bus,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Briefcase
} from 'lucide-react';
import { CompetitorPOI, ComplementaryBusinessPOI, DemandOpportunityMarker, LocationData } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface MarketMapProps {
  location: LocationData;
  onSelectAlternative?: () => void;
}

export const MarketMap: React.FC<MarketMapProps> = ({
  location,
  onSelectAlternative
}) => {
  const { t } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'COMPETITORS' | 'COMPLEMENTARY' | 'DEMAND'>('ALL');
  const [selectedEntity, setSelectedEntity] = useState<{
    title: string;
    type: string;
    distance?: string;
    notes: string;
    provenance: string;
  } | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [location.lat, location.lng],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    map.setView([location.lat, location.lng], 15);
    layerGroup.clearLayers();

    // 1. Proposed Location Pin
    const primaryIcon = L.divIcon({
      className: 'custom-primary-pin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
          <div style="background: #0F1E36; color: white; padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: bold; border: 2px solid #F59E0B; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); white-space: nowrap;">
            📍 Proposed Business Site
          </div>
          <div style="width: 14px; height: 14px; background: #0F1E36; border: 2px solid #F59E0B; transform: rotate(45deg); margin-top: -7px; border-radius: 2px;"></div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });

    L.marker([location.lat, location.lng], { icon: primaryIcon })
      .bindPopup(`<strong>${location.areaName}</strong><br/>Proposed Business Operating Location<br/>Coordinates: ${location.lat.toFixed(4)}°N, ${location.lng.toFixed(4)}°E`)
      .addTo(layerGroup);

    // 2. Alternative Recommended Site Marker
    if (location.alternativeLocation) {
      const altIcon = L.divIcon({
        className: 'custom-alt-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
            <div style="background: #047857; color: white; padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: bold; border: 2px solid #34D399; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); white-space: nowrap;">
              ⭐ Alternative Location (${location.alternativeLocation.score}/100)
            </div>
            <div style="width: 14px; height: 14px; background: #047857; border: 2px solid #34D399; transform: rotate(45deg); margin-top: -7px; border-radius: 2px;"></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const altMarker = L.marker([location.alternativeLocation.lat, location.alternativeLocation.lng], { icon: altIcon });
      altMarker.on('click', () => {
        setSelectedEntity({
          title: location.alternativeLocation!.areaName,
          type: 'Alternative Recommended Location',
          distance: `${location.alternativeLocation!.distanceKm} km away`,
          notes: location.alternativeLocation!.advantageReason,
          provenance: 'ESTIMATED / AI INTERPRETATION'
        });
      });
      altMarker.bindPopup(`<strong>${location.alternativeLocation.areaName}</strong><br/>${location.alternativeLocation.advantageReason}`);
      altMarker.addTo(layerGroup);
    }

    // 3. Competitor Markers
    if (activeFilter === 'ALL' || activeFilter === 'COMPETITORS') {
      location.competitors.forEach((comp) => {
        const compIcon = L.divIcon({
          className: 'custom-comp-pin',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: pointer;">
              <div style="background: #BE123C; color: white; padding: 2px 6px; border-radius: 6px; font-size: 10px; font-weight: 600; border: 1px solid #FDA4AF; box-shadow: 0 2px 4px rgba(0,0,0,0.2); white-space: nowrap;">
                🏪 ${comp.name.split(' ')[0]}
              </div>
              <div style="width: 8px; height: 8px; background: #BE123C; transform: rotate(45deg); margin-top: -4px;"></div>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });

        const marker = L.marker([comp.lat, comp.lng], { icon: compIcon });
        marker.on('click', () => {
          setSelectedEntity({
            title: comp.name,
            type: comp.type,
            distance: `${comp.distanceKm} km from site`,
            notes: `Market Strength: ${comp.strength}`,
            provenance: comp.provenance || 'DEMO / ESTIMATED DATA'
          });
        });
        marker.bindPopup(`<strong>${comp.name}</strong><br/>Type: ${comp.type}<br/>Distance: ${comp.distanceKm} km<br/><small style="color: #64748b;">Provenance: ${comp.provenance || 'DEMO / ESTIMATED DATA'}</small>`);
        marker.addTo(layerGroup);
      });
    }

    // 4. Complementary Business Markers
    if ((activeFilter === 'ALL' || activeFilter === 'COMPLEMENTARY') && location.complementaryBusinesses) {
      location.complementaryBusinesses.forEach((cb) => {
        const cbIcon = L.divIcon({
          className: 'custom-cb-pin',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: pointer;">
              <div style="background: #1E3A8A; color: white; padding: 2px 6px; border-radius: 6px; font-size: 10px; font-weight: 600; border: 1px solid #93C5FD; box-shadow: 0 2px 4px rgba(0,0,0,0.2); white-space: nowrap;">
                🏢 ${cb.name.split(' ')[0]}
              </div>
              <div style="width: 8px; height: 8px; background: #1E3A8A; transform: rotate(45deg); margin-top: -4px;"></div>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });

        const marker = L.marker([cb.lat, cb.lng], { icon: cbIcon });
        marker.on('click', () => {
          setSelectedEntity({
            title: cb.name,
            type: cb.type,
            distance: `${cb.distanceKm} km from site`,
            notes: cb.synergy,
            provenance: cb.provenance || 'ESTIMATED'
          });
        });
        marker.bindPopup(`<strong>${cb.name}</strong><br/>Type: ${cb.type}<br/>${cb.synergy}<br/><small style="color: #64748b;">Provenance: ${cb.provenance || 'ESTIMATED'}</small>`);
        marker.addTo(layerGroup);
      });
    }

    // 5. Demand Opportunity Markers
    if ((activeFilter === 'ALL' || activeFilter === 'DEMAND') && location.demandMarkers) {
      location.demandMarkers.forEach((dm) => {
        const dmIcon = L.divIcon({
          className: 'custom-dm-pin',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: pointer;">
              <div style="background: #D97706; color: white; padding: 2px 6px; border-radius: 6px; font-size: 10px; font-weight: 600; border: 1px solid #FCD34D; box-shadow: 0 2px 4px rgba(0,0,0,0.2); white-space: nowrap;">
                ⚡ ${dm.title.split(' ')[0]}
              </div>
              <div style="width: 8px; height: 8px; background: #D97706; transform: rotate(45deg); margin-top: -4px;"></div>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });

        const marker = L.marker([dm.lat, dm.lng], { icon: dmIcon });
        marker.on('click', () => {
          setSelectedEntity({
            title: dm.title,
            type: dm.type,
            notes: dm.detail,
            provenance: dm.provenance || 'ESTIMATED'
          });
        });
        marker.bindPopup(`<strong>${dm.title}</strong><br/>${dm.detail}<br/><small style="color: #64748b;">Provenance: ${dm.provenance || 'ESTIMATED'}</small>`);
        marker.addTo(layerGroup);
      });
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [location, activeFilter]);

  // Dispose the Leaflet map instance when the component unmounts
  useEffect(() => {
    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      layerGroupRef.current = null;
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Map Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-indigo-900" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {t.marketMapTitle}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.geographicCatchmentAround} {location.areaName} ({location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E)
          </p>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
              activeFilter === 'ALL' ? 'bg-indigo-950 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.allLayers}
          </button>
          <button
            onClick={() => setActiveFilter('COMPETITORS')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
              activeFilter === 'COMPETITORS' ? 'bg-indigo-950 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.competitorsFilter} ({location.competitorsNearbyCount})
          </button>
          <button
            onClick={() => setActiveFilter('COMPLEMENTARY')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
              activeFilter === 'COMPLEMENTARY' ? 'bg-indigo-950 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.anchorsFilter}
          </button>
          <button
            onClick={() => setActiveFilter('DEMAND')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
              activeFilter === 'DEMAND' ? 'bg-indigo-950 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.demandHubsFilter}
          </button>
        </div>
      </div>

      {/* Provenance and Integrity Banner */}
      <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs sm:text-sm text-slate-900 font-medium">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>{t.nonGoogleHeuristicNotice}</span>
        </div>
        <span className="text-[10px] uppercase font-bold text-slate-500 hidden sm:inline">
          {t.geoCatchmentBadge}
        </span>
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[460px] bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200 shadow-md text-[11px] space-y-1">
          <div className="flex items-center gap-2 font-medium text-slate-800">
            <span className="w-3 h-3 rounded-full bg-slate-900 border border-amber-400"></span>
            <span>{t.selectedOperatingSite}</span>
          </div>
          <div className="flex items-center gap-2 font-medium text-slate-800">
            <span className="w-3 h-3 rounded-full bg-emerald-600 border border-emerald-300"></span>
            <span>{t.recommendedAlternativeSite}</span>
          </div>
          <div className="flex items-center gap-2 font-medium text-slate-800">
            <span className="w-3 h-3 rounded-full bg-rose-600 border border-rose-300"></span>
            <span>{t.competingOutlets}</span>
          </div>
          <div className="flex items-center gap-2 font-medium text-slate-800">
            <span className="w-3 h-3 rounded-full bg-blue-700 border border-blue-300"></span>
            <span>{t.complementaryAnchors}</span>
          </div>
        </div>

        {/* Selected Entity Popup Inspector */}
        {selectedEntity && (
          <div className="absolute top-3 right-3 z-[1000] max-w-xs bg-white rounded-xl p-3.5 border border-slate-200 shadow-lg text-xs animate-in fade-in">
            <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
              <span>{selectedEntity.title}</span>
              <button
                onClick={() => setSelectedEntity(null)}
                className="text-slate-400 hover:text-slate-700 px-1 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="text-slate-600 space-y-1 mt-1">
              <div className="text-[11px]">Type: <strong className="text-slate-800">{selectedEntity.type}</strong></div>
              {selectedEntity.distance && <div className="text-[11px]">Distance: {selectedEntity.distance}</div>}
              <div className="text-[11px] text-slate-700 leading-snug">{selectedEntity.notes}</div>
              <div className="pt-1.5 mt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Data Origin:</span>
                <span className="font-extrabold px-1.5 py-0.2 rounded-xs bg-slate-100 text-slate-700 border border-slate-200">
                  {selectedEntity.provenance}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Local Market Breakdown Below Map */}
      <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Competitors Nearby */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase">
                <Store className="w-4 h-4 text-rose-600" />
                <span>{t.competitorsNearby}</span>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm border ${
                location.competitorsCountProvenance === 'MEASURED'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}>
                {location.competitorsCountProvenance === 'MEASURED' ? 'Measured' : 'Estimated'}
              </span>
            </div>
            <div className="text-xl font-extrabold text-slate-900 mb-1">
              {location.competitorsNearbyCount} {t.outletsUnit}
            </div>
            {location.competitors && location.competitors.length > 0 ? (
              <div className="mt-1 space-y-1">
                <p className="text-xs text-slate-800 font-medium">
                  Closest mapped: <strong className="font-bold">{location.competitors[0].name}</strong> ({location.competitors[0].distanceKm} km)
                </p>
                {location.competitors.length > 1 && (
                  <p className="text-[11px] text-slate-600 truncate">
                    Other: {location.competitors.slice(1, 4).map((c) => c.name).filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-700 font-medium mt-1">
                {location.competitorsNote || 'Within 1.5 km radial zone. Count is a model estimate.'}
              </p>
            )}
          </div>

          {/* Demand Signals */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>{t.demandSignals}</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm border bg-amber-50 text-amber-900 border-amber-300">
                Estimated
              </span>
            </div>
            <div className="text-xl font-extrabold text-slate-900 mb-1">
              {location.footfallMonthly.toLocaleString('en-IN')} {t.perMonth}
            </div>
            <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed mt-1">
              {location.demandSignals[0] || 'Steady footfall across peak morning & evening hours.'}
            </p>
          </div>

          {/* Customer Areas */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>{t.customerColonies}</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm border bg-amber-50 text-amber-900 border-amber-300">
                Estimated
              </span>
            </div>
            <div className="text-sm font-extrabold text-slate-950 mb-1 truncate">
              {location.customerColonies.slice(0, 2).join(', ')}
            </div>
            <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed mt-1">
              {location.residentialColoniesNearby} residential / commercial clusters feeding walk-in footfall.
            </p>
          </div>

          {/* Complementary Anchors */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase">
                <Briefcase className="w-4 h-4 text-blue-700" />
                <span>{t.nearbyAnchors}</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm border bg-amber-50 text-amber-900 border-amber-300">
                Estimated
              </span>
            </div>
            <div className="text-sm font-extrabold text-slate-950 mb-1 truncate">
              {location.complementaryBusinesses?.[0]?.name || 'Commercial Hub'}
            </div>
            <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed mt-1">
              {location.complementaryBusinesses?.[0]?.synergy || 'Generates daytime consumer walk-in traffic.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
