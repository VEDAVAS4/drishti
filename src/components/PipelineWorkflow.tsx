import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Play, 
  Sparkles, 
  MapPin, 
  Satellite, 
  Cpu, 
  Building2, 
  Scale, 
  Layers, 
  FileText,
  ChevronRight,
  RefreshCw,
  Terminal
} from 'lucide-react';
import { LocationRecord, SatelliteImage, AIPrediction, GovernmentRecord, VerificationResult } from '../types';

interface PipelineWorkflowProps {
  location: LocationRecord;
  satelliteImage?: SatelliteImage;
  prediction?: AIPrediction;
  governmentRecord?: GovernmentRecord;
  verification?: VerificationResult;
  onRunPipeline: () => Promise<void>;
  isRunning: boolean;
}

export const PipelineWorkflow: React.FC<PipelineWorkflowProps> = ({
  location,
  satelliteImage,
  prediction,
  governmentRecord,
  verification,
  onRunPipeline,
  isRunning
}) => {
  const [activeStage, setActiveStage] = useState<number>(3);

  const stages = [
    {
      id: 1,
      title: 'Location & Geofencing',
      shortDesc: 'Cadastral boundary polygon & coordinates ingestion',
      icon: MapPin,
      status: 'completed',
      details: {
        coordinates: `${location.latitude}°N, ${location.longitude}°E`,
        surveyNumber: location.surveyNumber,
        registeredArea: `${location.plotAreaSqm.toLocaleString()} m²`,
        bufferRadius: `${location.bufferMeters}m Protection Geofence`,
        subDivision: 'Verified Cadastral Survey'
      }
    },
    {
      id: 2,
      title: 'Satellite Ingestion',
      shortDesc: 'Sentinel-2 L2A optical & multi-spectral bands',
      icon: Satellite,
      status: satelliteImage ? 'completed' : 'pending',
      details: {
        provider: satelliteImage?.provider.toUpperCase() || 'SENTINEL-2B',
        sceneId: satelliteImage?.sceneId || 'S2B_MSIL2A_T44QND',
        resolution: `${satelliteImage?.resolutionMeters || 10}m Ground Sampling Distance (GSD)`,
        cloudCover: `${satelliteImage?.cloudCoverPercent || 2.1}%`,
        spectralBands: 'B02 (Blue), B03 (Green), B04 (Red), B08 (NIR), B11 (SWIR)',
        captureDate: satelliteImage?.captureDate || '2026-09-15'
      }
    },
    {
      id: 3,
      title: 'Deep Vision AI Inference',
      shortDesc: 'YOLOv8l structure detection & NDVI vegetation index',
      icon: Cpu,
      status: prediction ? 'completed' : 'pending',
      details: {
        modelArchitecture: prediction?.modelVersion || 'YOLOv8l-Drishti-SatBuild-v2.4',
        structuresIdentified: `${prediction?.buildingCount || 3} detected footprints`,
        totalBuiltUpArea: `${prediction?.totalBuiltAreaSqm || 1420} m²`,
        primaryClassification: prediction?.primaryClass.replace('_', ' ').toUpperCase() || 'COMMERCIAL AREA',
        confidenceScore: `${((prediction?.confidence || 0.942) * 100).toFixed(1)}%`,
        ndviVegetationShift: `${prediction?.ndviChangePercent || -82.35}% drop over baseline`
      }
    },
    {
      id: 4,
      title: 'Revenue Cadastre Sync',
      shortDesc: 'Official Record of Rights (Pahani) and master plan zoning',
      icon: Building2,
      status: governmentRecord ? 'completed' : 'pending',
      details: {
        sourceRegistry: governmentRecord?.recordSource.toUpperCase().replace('_', ' ') || 'REVENUE DEPT',
        registeredOwner: governmentRecord?.registeredOwnerName || 'M. Rama Rao & Brothers',
        officialZoning: governmentRecord?.zoningClassification || 'Agricultural Dry Crop Zone',
        statutoryFSI: governmentRecord?.permittedFloors === 0 ? 'FSI 0.0 (Zero Construction Allowed)' : `G+${governmentRecord?.permittedFloors}`,
        pattaNumber: governmentRecord?.pattaNumber || 'AP-GNT-10992'
      }
    },
    {
      id: 5,
      title: 'Verification Engine',
      shortDesc: 'Compatibility matrix & 5-factor ensemble evidence score',
      icon: Scale,
      status: verification ? 'completed' : 'pending',
      details: {
        statutoryStatus: verification?.verificationStatus.toUpperCase() || 'MISMATCH',
        violationClassification: verification?.violationType.toUpperCase().replace(/_/g, ' ') || 'UNAUTHORIZED CONSTRUCTION',
        evidenceConfidence: `${((verification?.evidenceScore || 0.945) * 100).toFixed(1)}%`,
        compatibilityScore: `${((verification?.compatibilityScore || 0.08) * 100).toFixed(0)}% (Severe Mismatch)`,
        spatialOverlap: `${((verification?.spatialOverlapScore || 0.94) * 100).toFixed(0)}%`,
        statutoryRecommendation: verification?.recommendation || 'Issue Section 115 Stop-Work Notice'
      }
    },
    {
      id: 6,
      title: 'GIS Inspection & Ground Truth',
      shortDesc: 'Multi-temporal swipe & mobile drone inspection sync',
      icon: Layers,
      status: 'completed',
      details: {
        temporalComparison: '365-day optical change analysis',
        groundTruthSync: 'Active (2 Geotagged Field Photos verified)',
        accuracyGPS: '±2.4m RTK differential correction',
        officerSeal: 'Verified by Divisional Revenue Inspector'
      }
    },
    {
      id: 7,
      title: 'Statutory Evidence Report',
      shortDesc: 'Cryptographically sealed PDF and audit dossier',
      icon: FileText,
      status: verification ? 'completed' : 'pending',
      details: {
        reportDossierNumber: `DRISHTI-VER-2026-${location.surveyNumber.replace('/', '-')}`,
        cryptographicHash: 'SHA-256: 8a4f91e32d67cc819bf405e638102a94f0e7a12cb59f018e6c40a5b2811a09d1',
        legalAdmissibility: 'Admissible under Indian Evidence Act Section 65B',
        qrVerificationCode: 'Active & Scannable'
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Action Button */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-emerald-400 font-mono uppercase tracking-wider">
              Autonomous Verification Pipeline
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
              7 of 7 Operational
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Real-Time Cadastral Verification: {location.locationName}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-referencing Sentinel-2 optical telemetry with State Revenue Cadastre records using YOLOv8 deep vision.
          </p>
        </div>

        <button
          onClick={onRunPipeline}
          disabled={isRunning}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-semibold text-xs tracking-wide transition shadow-lg shrink-0 ${
            isRunning 
              ? 'bg-emerald-600/50 text-white cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 hover:shadow-emerald-600/50'
          }`}
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Running Autonomous Verification...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Live Pipeline Simulation</span>
            </>
          )}
        </button>
      </div>

      {/* Pipeline Stepper Progression Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {stages.map((stage) => {
          const IconComponent = stage.icon;
          const isSelected = activeStage === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/90 border-emerald-500/80 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                  }`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    0{stage.id}
                  </span>
                </div>
                <div className="font-semibold text-xs text-white mt-2.5 truncate">
                  {stage.title}
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                  {stage.shortDesc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-emerald-400 flex items-center font-medium">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Ready
                </span>
                <ChevronRight className={`w-3 h-3 ${isSelected ? 'text-emerald-400' : 'text-slate-600'}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Deep-Dive Inspector */}
      {activeStage && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
                {activeStage}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Stage {activeStage}: {stages[activeStage - 1].title}
                </h3>
                <p className="text-xs text-slate-400">
                  {stages[activeStage - 1].shortDesc}
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400">
              Pipeline State: VERIFIED_PASS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {Object.entries(stages[activeStage - 1].details).map(([key, value]) => (
              <div key={key} className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  {key.replace(/([A-Z])/g, ' $1')}
                </div>
                <div className="text-xs font-semibold text-slate-200 mt-1 break-words">
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Code & Logic Snippet Preview */}
          <div className="mt-4 bg-slate-950 border border-slate-800/90 rounded-lg p-3 font-mono text-xs text-slate-300">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5 mb-2">
              <span className="flex items-center">
                <Terminal className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                Pipeline Stage {activeStage} Backend Execution Telemetry
              </span>
              <span className="text-[10px] text-slate-400">Execution time: 412ms</span>
            </div>
            <pre className="text-emerald-400 text-[11px] overflow-x-auto">
{activeStage === 3 ? `// YOLOv8l Detection Output on Sentinel-2 Scene T44QND
const yoloInference = await drishtiYolo.predict({
  inputPatch: "sentinel2_b02_b03_b04.tif",
  confidenceThreshold: 0.75,
  nmsThreshold: 0.45
});
// Result: 3 structures detected, 1420m² total footprint, NDVI shift = -82.35%` 
: activeStage === 5 ? `// 5-Factor Verification Algorithm
const compatibility = checkZoningPermissibility(aiPrimaryUse, govtRecordUse);
const spatialOverlap = ST_Intersection(yoloPolygon, cadastralBoundary);
const evidenceScore = 0.35 * conf + 0.30 * overlap + 0.20 * recency + 0.15 * quality;
// Violation Classification: UNAUTHORIZED_CONSTRUCTION (Evidence Score: 0.945)` 
: `// Stage ${activeStage} telemetry payload synchronized with PostGIS 15 cluster
// Node: drishti-worker-asia-south1-a | Status: 200 OK`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
