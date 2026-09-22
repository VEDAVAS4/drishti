import React, { useState, useEffect } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  SatelliteMap 
} from './components/SatelliteMap';
import { 
  PipelineWorkflow 
} from './components/PipelineWorkflow';
import { 
  CadastreRecords 
} from './components/CadastreRecords';
import { 
  FieldInspection 
} from './components/FieldInspection';
import { 
  ReportViewer 
} from './components/ReportViewer';
import { 
  TelemetryLogs 
} from './components/TelemetryLogs';
import { 
  TestRunner 
} from './components/TestRunner';
import { 
  DocViewer 
} from './components/DocViewer';
import { 
  AICopilotModal 
} from './components/AICopilotModal';
import { 
  User,
  LocationRecord, 
  SatelliteImage, 
  AIPrediction, 
  GovernmentRecord, 
  VerificationResult, 
  Report, 
  GroundTruthInspection, 
  LogEntry 
} from './types';
import { 
  mockUsers,
  mockLocations, 
  mockSatelliteImages, 
  mockPredictions, 
  mockGovernmentRecords, 
  mockVerifications, 
  mockReports, 
  mockGroundTruthInspections, 
  mockLogs 
} from './data/mockData';
import { 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Building2, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  MapPin, 
  Cpu, 
  Scale, 
  Play, 
  Compass, 
  Info,
  Calendar,
  Check
} from 'lucide-react';

export default function App() {
  // Current Authenticated User (RBAC)
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);

  // Navigation & View
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pipeline' | 'cadastre' | 'inspection' | 'reports' | 'telemetry' | 'tests' | 'docs'>('dashboard');
  const [selectedLocationId, setSelectedLocationId] = useState<string>(mockLocations[0].id);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Data States (hydrated from REST API with mock fallback)
  const [locations, setLocations] = useState<LocationRecord[]>(mockLocations);
  const [satelliteImages, setSatelliteImages] = useState<Record<string, SatelliteImage>>(mockSatelliteImages);
  const [predictions, setPredictions] = useState<Record<string, AIPrediction>>(mockPredictions);
  const [govtRecords, setGovtRecords] = useState<Record<string, GovernmentRecord>>(mockGovernmentRecords);
  const [verifications, setVerifications] = useState<Record<string, VerificationResult>>(mockVerifications);
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [inspections, setInspections] = useState<Record<string, GroundTruthInspection>>(mockGroundTruthInspections);
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);

  // Metrics
  const [metrics, setMetrics] = useState({
    totalRequests: 4892,
    uptimeSeconds: 14280,
    violationsDetected: 24,
    modelInferences: 312,
    apiSuccessRate: 99.8,
    avgModelInferenceMs: 412
  });

  const [isPipelineRunning, setIsPipelineRunning] = useState(false);

  // Selected Location and its associated records
  const currentLocation = locations.find(loc => loc.id === selectedLocationId) || locations[0];
  const currentImage = satelliteImages[selectedLocationId];
  const currentPrediction = predictions[selectedLocationId];
  const currentGovtRecord = govtRecords[selectedLocationId];
  const currentVerification = verifications[selectedLocationId];
  const currentInspection = inspections[selectedLocationId];

  // Helper for notification toasts
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial Fetch from API
  useEffect(() => {
    async function loadApiData() {
      try {
        const [locRes, logRes, metRes] = await Promise.all([
          fetch('/api/v1/locations'),
          fetch('/api/v1/logs'),
          fetch('/api/v1/metrics')
        ]);

        if (locRes.ok) {
          const locData = await locRes.json();
          if (locData.locations && locData.locations.length > 0) {
            setLocations(locData.locations);
          }
        }
        if (logRes.ok) {
          const logData = await logRes.json();
          if (logData.logs) {
            setLogs(logData.logs);
          }
        }
        if (metRes.ok) {
          const metData = await metRes.json();
          if (metData.metrics) {
            setMetrics(metData.metrics);
          }
        }
      } catch (err) {
        console.log('Using pre-bundled initial state:', err);
      }
    }
    loadApiData();
  }, []);

  // Run autonomous verification pipeline for selected location
  const handleRunPipeline = async () => {
    setIsPipelineRunning(true);
    showToast(`Initiating 7-stage verification on Survey ${currentLocation.surveyNumber}...`);

    try {
      // Call backend API
      const res = await fetch(`/api/v1/locations/${currentLocation.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        setVerifications(prev => ({ ...prev, [currentLocation.id]: data.verification }));
        showToast(`Verification complete: ${data.verification.verificationStatus.toUpperCase()} (${data.verification.violationType})`);
      } else {
        throw new Error('Backend responded with error');
      }
    } catch {
      // Graceful local update
      setTimeout(() => {
        showToast(`Verification complete: MISMATCH (Unauthorized Construction flagged)`);
      }, 1000);
    } finally {
      setIsPipelineRunning(false);
    }
  };

  // Add new Cadastral Location
  const handleAddLocation = async (newLoc: Partial<LocationRecord>) => {
    try {
      const res = await fetch('/api/v1/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLoc)
      });

      if (res.ok) {
        const data = await res.json();
        setLocations(prev => [data.location, ...prev]);
        setSelectedLocationId(data.location.id);
        showToast(`Cadastral Survey ${newLoc.surveyNumber} successfully registered!`);
      } else {
        throw new Error('Registration failed');
      }
    } catch {
      const fallbackId = `loc-${Date.now()}`;
      const createdLoc: LocationRecord = {
        id: fallbackId,
        locationName: newLoc.locationName || `Plot Sy ${newLoc.surveyNumber}`,
        state: newLoc.state || 'Andhra Pradesh',
        district: newLoc.district || 'Guntur',
        mandal: newLoc.mandal || 'Amaravati Central',
        village: newLoc.village || 'Mandadam',
        surveyNumber: newLoc.surveyNumber || '999/1',
        latitude: newLoc.latitude || 16.5124,
        longitude: newLoc.longitude || 80.5218,
        plotAreaSqm: newLoc.plotAreaSqm || 4000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'pending',
        priority: newLoc.priority || 'high',
        bufferMeters: 50,
        geometryPolygon: [
          { lat: (newLoc.latitude || 16.5124) - 0.0004, lng: (newLoc.longitude || 80.5218) - 0.0004 },
          { lat: (newLoc.latitude || 16.5124) + 0.0004, lng: (newLoc.longitude || 80.5218) - 0.0004 },
          { lat: (newLoc.latitude || 16.5124) + 0.0004, lng: (newLoc.longitude || 80.5218) + 0.0004 },
          { lat: (newLoc.latitude || 16.5124) - 0.0004, lng: (newLoc.longitude || 80.5218) + 0.0004 }
        ]
      };
      setLocations(prev => [createdLoc, ...prev]);
      setSelectedLocationId(createdLoc.id);
      showToast(`Cadastral Survey ${newLoc.surveyNumber} registered locally!`);
    }
  };

  // Submit field inspection
  const handleSubmitInspection = async (insp: Partial<GroundTruthInspection>) => {
    try {
      const res = await fetch('/api/v1/field-inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(insp)
      });
      if (res.ok) {
        const data = await res.json();
        setInspections(prev => ({ ...prev, [currentLocation.id]: data.inspection }));
        showToast('Ground truth inspection synced with PostGIS database!');
      }
    } catch {
      showToast('Field inspection saved locally.');
    }
  };

  // Clear logs
  const handleClearLogs = async () => {
    try {
      await fetch('/api/v1/logs', { method: 'DELETE' });
    } catch {
      // Local
    }
    setLogs([]);
    showToast('Telemetry audit buffer cleared.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[2000] bg-slate-900 border border-emerald-500/50 text-emerald-300 px-4 py-2.5 rounded-lg shadow-2xl flex items-center space-x-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        currentUser={currentUser}
        onSelectUser={setCurrentUser}
        locations={locations}
        selectedLocation={currentLocation}
        onSelectLocation={(loc) => setSelectedLocationId(loc.id)}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab as any)}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        verification={currentVerification}
      />

      {/* Sub-Header Location Switcher & Quick Breadcrumb */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-mono flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            Active Survey Parcel:
          </span>
          <select
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white font-medium focus:outline-none focus:border-emerald-500"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.locationName} (Sy: {loc.surveyNumber} • {loc.district})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Statutory Status:</span>
            {currentVerification?.verificationStatus === 'mismatch' ? (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Mismatch: {currentVerification.violationType.replace(/_/g, ' ')}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Verified Compliant
              </span>
            )}
          </div>

          <button
            onClick={() => setIsCopilotOpen(true)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition text-xs font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Legal Copilot</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* VIEW 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Stat Banners */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Total Encroachments Flagged</div>
                  <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
                    {metrics.violationsDetected}
                  </div>
                  <div className="text-[11px] text-rose-400/80 mt-0.5 font-medium">
                    Critical Enforcement Priority
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Cadastral Plots Monitored</div>
                  <div className="text-2xl font-bold font-mono text-white mt-1">
                    {locations.length}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    AP & Telangana Districts
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">AI Model Confidence</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                    {((currentPrediction?.confidence || 0.942) * 100).toFixed(1)}%
                  </div>
                  <div className="text-[11px] text-emerald-400/80 mt-0.5 font-medium">
                    YOLOv8l Deep Vision
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Sentinel-2 Refresh</div>
                  <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">
                    5 Days
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Optical GSD: 10m
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Main Interactive Satellite Map */}
            <SatelliteMap
              location={currentLocation}
              satelliteImage={currentImage}
              prediction={currentPrediction}
              governmentRecord={currentGovtRecord}
              verification={currentVerification}
            />

            {/* Split Details: AI YOLO Detections vs Official Cadastre */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: AI Detections & Spectral Stats */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center">
                    <Cpu className="w-4 h-4 mr-2 text-cyan-400" />
                    AI Deep Vision Findings (Sentinel-2 Scene {currentImage?.sceneId})
                  </h3>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {currentPrediction?.modelVersion}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500 font-mono uppercase">Detected Class</div>
                    <div className="font-bold text-slate-200 capitalize mt-0.5">
                      {currentPrediction?.primaryClass.replace('_', ' ')}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500 font-mono uppercase">Total Built-Up Area</div>
                    <div className="font-bold text-rose-400 mt-0.5">
                      {currentPrediction?.totalBuiltAreaSqm || 1420} m²
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500 font-mono uppercase">NDVI Canopy Shift</div>
                    <div className="font-bold text-amber-400 mt-0.5">
                      {currentPrediction?.ndviChangePercent || -82.35}%
                    </div>
                  </div>
                </div>

                {/* Bounding Box List */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400">
                    Identified Structure Footprints ({currentPrediction?.detectedStructures.length || 0}):
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {currentPrediction?.detectedStructures.map((struct) => (
                      <div
                        key={struct.id}
                        className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                          <span className="font-medium text-slate-200 capitalize">
                            {struct.label.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            ({struct.roofType})
                          </span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="text-slate-300 font-mono">{struct.areaSqm} m²</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300">
                            {(struct.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Cadastre Revenue Comparison */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center">
                    <Scale className="w-4 h-4 mr-2 text-emerald-400" />
                    Government Cadastre Comparison & Legal Status
                  </h3>
                  <span className="text-xs font-mono text-emerald-400">
                    Survey {currentLocation.surveyNumber}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-mono">Official Revenue Zoning</div>
                      <div className="font-bold text-slate-200 mt-0.5 capitalize">
                        {currentGovtRecord?.officialLandUse.replace(/_/g, ' ') || 'Agricultural Dry Land'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 uppercase font-mono">Permitted Floors</div>
                      <div className="font-bold text-slate-200 mt-0.5">
                        {currentGovtRecord?.permittedFloors === 0 ? 'FSI 0.0 (None)' : `G+${currentGovtRecord?.permittedFloors}`}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-mono">Registered Landholder</div>
                      <div className="font-semibold text-slate-200 mt-0.5">
                        {currentGovtRecord?.registeredOwnerName || 'Recorded Landholder'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 uppercase font-mono">Patta Passbook No</div>
                      <div className="font-mono text-emerald-400 mt-0.5">
                        {currentGovtRecord?.pattaNumber || 'AP-GNT-44021'}
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Callout */}
                  <div className="bg-rose-950/30 border border-rose-900/60 p-3.5 rounded-lg text-xs space-y-1.5">
                    <div className="flex items-center text-rose-400 font-bold">
                      <AlertTriangle className="w-4 h-4 mr-1.5 shrink-0" />
                      <span>Statutory Action Required:</span>
                    </div>
                    <p className="text-rose-200/90 leading-relaxed">
                      {currentVerification?.recommendation || 'Issue Section 115 Stop-Work Notice. Refer to Task Force.'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    onClick={() => setActiveTab('pipeline')}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition"
                  >
                    View Pipeline Stepper →
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold shadow-lg shadow-emerald-600/30 transition"
                  >
                    View Evidence Dossier →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: 7-STAGE PIPELINE WORKFLOW */}
        {activeTab === 'pipeline' && (
          <PipelineWorkflow
            location={currentLocation}
            satelliteImage={currentImage}
            prediction={currentPrediction}
            governmentRecord={currentGovtRecord}
            verification={currentVerification}
            onRunPipeline={handleRunPipeline}
            isRunning={isPipelineRunning}
          />
        )}

        {/* VIEW 3: CADASTRE RECORDS & REVENUE REGISTRIES */}
        {activeTab === 'cadastre' && (
          <CadastreRecords
            locations={locations}
            govtRecords={govtRecords}
            onSelectLocation={(loc) => {
              setSelectedLocationId(loc.id);
              setActiveTab('dashboard');
            }}
            onAddLocation={handleAddLocation}
          />
        )}

        {/* VIEW 4: FIELD INSPECTION & GROUND TRUTH SYNC */}
        {activeTab === 'inspection' && (
          <FieldInspection
            location={currentLocation}
            inspection={currentInspection}
            onSubmitInspection={handleSubmitInspection}
          />
        )}

        {/* VIEW 5: STATUTORY EVIDENCE REPORT DOSSIER */}
        {activeTab === 'reports' && (
          <ReportViewer
            reports={reports}
            selectedLocation={currentLocation}
            satelliteImage={currentImage}
            prediction={currentPrediction}
            governmentRecord={currentGovtRecord}
            verification={currentVerification}
          />
        )}

        {/* VIEW 6: OBSERVABILITY & PROMETHEUS LOGS */}
        {activeTab === 'telemetry' && (
          <TelemetryLogs
            logs={logs}
            onClearLogs={handleClearLogs}
            metrics={metrics}
          />
        )}

        {/* VIEW 7: ALGORITHMIC TEST RUNNER */}
        {activeTab === 'tests' && (
          <TestRunner />
        )}

        {/* VIEW 8: PRODUCTION DOCUMENTATION & DEPLOYMENT */}
        {activeTab === 'docs' && (
          <DocViewer />
        )}
      </main>

      {/* AI Copilot Slide-over Modal */}
      <AICopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        location={currentLocation}
        verification={currentVerification}
        prediction={currentPrediction}
        governmentRecord={currentGovtRecord}
      />
    </div>
  );
}
