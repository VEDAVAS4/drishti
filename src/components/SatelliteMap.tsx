import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  Eye, 
  SplitSquareVertical, 
  Maximize2, 
  MapPin, 
  Sparkles, 
  Sliders, 
  Compass, 
  ShieldAlert,
  Info
} from 'lucide-react';
import { LocationRecord, SatelliteImage, AIPrediction, GovernmentRecord, VerificationResult } from '../types';

interface SatelliteMapProps {
  location: LocationRecord;
  satelliteImage?: SatelliteImage;
  prediction?: AIPrediction;
  governmentRecord?: GovernmentRecord;
  verification?: VerificationResult;
}

export const SatelliteMap: React.FC<SatelliteMapProps> = ({
  location,
  satelliteImage,
  prediction,
  governmentRecord,
  verification
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayerRef = useRef<L.Polygon | null>(null);
  const bufferLayerRef = useRef<L.Circle | null>(null);
  const boxesGroupRef = useRef<L.LayerGroup | null>(null);

  // View state
  const [bandMode, setBandMode] = useState<'rgb' | 'nir' | 'ndvi'>('rgb');
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [showBoundary, setShowBoundary] = useState<boolean>(true);
  const [showBufferZone, setShowBufferZone] = useState<boolean>(true);
  const [isSplitMode, setIsSplitMode] = useState<boolean>(false);
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [location.latitude, location.longitude],
        zoom: 17,
        zoomControl: true,
        attributionControl: false
      });

      // High-res Esri World Imagery (satellite basemap)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Esri, Maxar, Earthstar Geographics'
      }).addTo(map);

      // Label Overlay for roads and town names
      L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        opacity: 0.7
      }).addTo(map);

      mapInstanceRef.current = map;
      boxesGroupRef.current = L.layerGroup().addTo(map);
    } else {
      mapInstanceRef.current.setView([location.latitude, location.longitude], 17);
    }

    return () => {
      // Don't destroy on every re-render to avoid flashing, keep instance alive
    };
  }, [location.id]);

  // Update Geometry & Bounding Boxes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Cadastral Boundary Polygon
    if (polygonLayerRef.current) {
      polygonLayerRef.current.remove();
    }
    if (bufferLayerRef.current) {
      bufferLayerRef.current.remove();
    }

    if (showBoundary && location.geometryPolygon && location.geometryPolygon.length > 0) {
      const latlngs: L.LatLngTuple[] = location.geometryPolygon.map(p => [p.lat, p.lng]);
      const polygon = L.polygon(latlngs, {
        color: verification?.verificationStatus === 'mismatch' ? '#f43f5e' : '#10b981',
        weight: 3,
        fillColor: verification?.verificationStatus === 'mismatch' ? '#f43f5e' : '#10b981',
        fillOpacity: 0.15,
        dashArray: '4, 4'
      }).addTo(map);

      polygon.bindPopup(`
        <div class="text-xs">
          <div class="font-bold text-slate-100">${location.locationName}</div>
          <div class="text-slate-300 font-mono mt-1">Survey No: ${location.surveyNumber}</div>
          <div class="text-slate-400 mt-1">Registered Plot Area: ${location.plotAreaSqm.toLocaleString()} m²</div>
          <div class="text-slate-400">Zoning: ${governmentRecord?.officialLandUse || 'Agricultural'}</div>
        </div>
      `);
      polygonLayerRef.current = polygon;
    }

    // 2. Buffer Zone Circle
    if (showBufferZone) {
      const buffer = L.circle([location.latitude, location.longitude], {
        radius: location.bufferMeters || 50,
        color: '#38bdf8',
        weight: 1,
        fillColor: '#38bdf8',
        fillOpacity: 0.08,
        dashArray: '2, 6'
      }).addTo(map);

      buffer.bindTooltip(`Statutory Buffer: ${location.bufferMeters}m Protection Radius`, { permanent: false });
      bufferLayerRef.current = buffer;
    }

    // 3. Detected Structure Bounding Boxes (YOLOv8)
    if (boxesGroupRef.current) {
      boxesGroupRef.current.clearLayers();

      if (showBoundingBoxes && prediction?.detectedStructures) {
        const centerLat = location.latitude;
        const centerLng = location.longitude;

        prediction.detectedStructures.forEach((struct) => {
          // Project relative percent coordinates into local geospatial bounding box
          const offsetLat = (struct.y - 50) * 0.00003;
          const offsetLng = (struct.x - 50) * 0.000035;
          const heightDeg = (struct.height * 0.000028);
          const widthDeg = (struct.width * 0.000032);

          const southWest: L.LatLngTuple = [centerLat + offsetLat, centerLng + offsetLng];
          const northEast: L.LatLngTuple = [centerLat + offsetLat + heightDeg, centerLng + offsetLng + widthDeg];

          const isViolation = verification?.verificationStatus === 'mismatch';

          const rect = L.rectangle([southWest, northEast], {
            color: isViolation ? '#ef4444' : '#06b6d4',
            weight: 2,
            fillColor: isViolation ? '#ef4444' : '#06b6d4',
            fillOpacity: 0.28
          });

          rect.bindPopup(`
            <div class="p-1 text-xs">
              <div class="font-bold uppercase text-slate-100 flex items-center justify-between">
                <span>${struct.label.replace('_', ' ')}</span>
                <span class="px-1.5 py-0.5 rounded text-[10px] ${struct.confidence > 0.9 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}">
                  ${(struct.confidence * 100).toFixed(1)}% Conf
                </span>
              </div>
              <div class="text-slate-300 mt-1.5">Floor Area: <b class="text-white">${struct.areaSqm} m²</b></div>
              <div class="text-slate-400 text-[11px] mt-0.5">Roof Spec: ${struct.roofType || 'Reinforced Concrete'}</div>
              <div class="mt-2 pt-1 border-t border-slate-700 text-[10px] text-amber-400">
                Model: ${prediction.modelVersion}
              </div>
            </div>
          `);

          boxesGroupRef.current?.addLayer(rect);
        });
      }
    }
  }, [location, prediction, showBoundary, showBufferZone, showBoundingBoxes, verification]);

  const handleResetCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([location.latitude, location.longitude], 17);
    }
  };

  return (
    <div className="relative w-full h-[620px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex flex-col">
      {/* Top Map Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Layer & Spectral Selectors */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-lg border border-slate-800 shadow-xl pointer-events-auto">
          <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center">
            <Layers className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Spectral Band:
          </span>

          <button
            onClick={() => setBandMode('rgb')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition ${
              bandMode === 'rgb' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            True Color (RGB)
          </button>

          <button
            onClick={() => setBandMode('nir')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition ${
              bandMode === 'nir' 
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Color Infrared (NIR)
          </button>

          <button
            onClick={() => setBandMode('ndvi')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition ${
              bandMode === 'ndvi' 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            NDVI Vegetation Index
          </button>
        </div>

        {/* Feature Toggles & Split View Button */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-lg border border-slate-800 shadow-xl pointer-events-auto">
          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className={`px-2 py-1 rounded text-xs font-medium flex items-center space-x-1 transition ${
              showBoundingBoxes ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
            }`}
            title="Toggle YOLOv8 Structure Detection Boxes"
          >
            <Eye className="w-3 h-3 mr-1" />
            <span>AI Boxes ({prediction?.detectedStructures.length || 0})</span>
          </button>

          <button
            onClick={() => setShowBoundary(!showBoundary)}
            className={`px-2 py-1 rounded text-xs font-medium flex items-center space-x-1 transition ${
              showBoundary ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400'
            }`}
            title="Toggle Cadastral Survey Boundary"
          >
            <span>Parcel Boundary</span>
          </button>

          <button
            onClick={() => setIsSplitMode(!isSplitMode)}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center space-x-1 transition ${
              isSplitMode ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Side-by-side Historical vs Current Temporal Comparison"
          >
            <SplitSquareVertical className="w-3.5 h-3.5 mr-1" />
            <span>Temporal Swipe</span>
          </button>

          <button
            onClick={handleResetCenter}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title="Center on Parcel"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative flex-1 w-full h-full">
        {/* Leaflet Canvas */}
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Band Mode Visual Simulator Overlays (NIR / NDVI) */}
        {bandMode === 'nir' && (
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-40 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(217, 70, 239, 0.45) 0%, rgba(147, 51, 234, 0.25) 70%, transparent 100%)'
            }}
          />
        )}

        {bandMode === 'ndvi' && (
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-screen opacity-45 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.3) 0%, rgba(239, 68, 68, 0.4) 40%, rgba(34, 197, 94, 0.3) 100%)'
            }}
          />
        )}

        {/* Temporal Swipe Overlay when active */}
        {isSplitMode && satelliteImage && (
          <div className="absolute inset-0 pointer-events-none z-[800]">
            <div 
              className="absolute top-0 bottom-0 left-0 overflow-hidden border-r-2 border-amber-400 shadow-2xl pointer-events-auto"
              style={{ width: `${sliderPosition}%` }}
            >
              <img 
                src={satelliteImage.historicalImageUrl} 
                alt="Historical Sentinel-2" 
                className="absolute top-0 left-0 w-[1200px] h-[700px] max-w-none object-cover brightness-95"
              />
              <div className="absolute top-16 left-4 bg-slate-900/90 text-amber-300 text-xs font-mono px-2.5 py-1 rounded border border-amber-500/40">
                HISTORICAL: {satelliteImage.historicalCaptureDate} (T-0)
              </div>
            </div>

            <div className="absolute top-16 right-4 bg-slate-900/90 text-emerald-300 text-xs font-mono px-2.5 py-1 rounded border border-emerald-500/40">
              CURRENT: {satelliteImage.captureDate} (T-1)
            </div>

            {/* Draggable Slider Control */}
            <div 
              className="absolute top-0 bottom-0 -ml-3 w-6 flex items-center justify-center pointer-events-auto cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
            >
              <input 
                type="range" 
                min="5" 
                max="95" 
                value={sliderPosition} 
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="w-full opacity-0 cursor-ew-resize"
              />
              <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg font-bold text-[10px]">
                ⮂
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Map Info Footer */}
      <div className="bg-slate-950/95 border-t border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between text-xs gap-3 z-[900]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Coordinates:</span>
            <span className="font-mono text-slate-200">
              {location.latitude.toFixed(5)}°N, {location.longitude.toFixed(5)}°E
            </span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Resolution:</span>
            <span className="text-emerald-400 font-mono">10m GSD (Sentinel-2)</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Cloud Cover:</span>
            <span className="text-slate-200">{satelliteImage?.cloudCoverPercent || 2.1}%</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px]">
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block"></span>
            <span className="text-slate-300">Unauthorized Structure</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>
            <span className="text-slate-300">Cadastral Boundary</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500 inline-block"></span>
            <span className="text-slate-300">YOLO Footprint</span>
          </div>
        </div>
      </div>
    </div>
  );
};
