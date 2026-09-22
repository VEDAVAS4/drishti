import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  CheckSquare, 
  Mic, 
  Upload, 
  ShieldAlert, 
  CheckCircle2, 
  Compass, 
  FileText, 
  Send,
  Radio,
  Image as ImageIcon
} from 'lucide-react';
import { GroundTruthInspection, LocationRecord } from '../types';

interface FieldInspectionProps {
  location: LocationRecord;
  inspection?: GroundTruthInspection;
  onSubmitInspection: (insp: Partial<GroundTruthInspection>) => Promise<void>;
}

export const FieldInspection: React.FC<FieldInspectionProps> = ({
  location,
  inspection,
  onSubmitInspection
}) => {
  const [activeChecklist, setActiveChecklist] = useState({
    activeConstruction: true,
    heavyMachineryPresent: true,
    noPermitBoardDisplayed: true,
    foundationWorkUnderway: true,
    rccPillarsErected: true,
    roofingInstalled: false
  });

  const [structureType, setStructureType] = useState('Commercial Warehouse / Function Hall');
  const [remarks, setRemarks] = useState(
    'Ground reality directly matches the satellite AI prediction. Physical construction is ongoing on agricultural land without required NALA conversion. Contractor was unable to produce sanctioned building blueprint.'
  );
  const [recommendation, setRecommendation] = useState<'issue_stop_work_notice' | 'schedule_demolition' | 'regularization_possible' | 'case_closed'>('issue_stop_work_notice');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceRecorded, setVoiceRecorded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitInspection({
        locationId: location.id,
        inspectorName: 'K. V. Naidu (DRI)',
        constructionActive: activeChecklist.activeConstruction,
        observedStructureType: structureType,
        officerRemarks: remarks,
        recommendedAction: recommendation,
        gpsCoordinates: { lat: location.latitude, lng: location.longitude }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-emerald-400 font-mono uppercase tracking-wider">
              Ground-Truth & Drone Verification Module
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
              Mobile Handheld / Drone RTK Sync
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Field Officer Ground Inspection: {location.locationName}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Collect geotagged photographs, GPS coordinates, structural observations, and statutory violation checklists on-site.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-mono">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>GPS RTK FIX: ±2.4m</span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400 font-mono">
            Lat: {location.latitude.toFixed(4)}°, Lng: {location.longitude.toFixed(4)}°
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form & Checklist */}
        <div className="lg:col-span-2 space-y-5">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2.5 flex items-center">
              <CheckSquare className="w-4 h-4 mr-2 text-emerald-400" />
              On-Site Violation & Construction Checklist
            </h3>

            {/* Checklist Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <label className="flex items-center space-x-2.5 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeChecklist.activeConstruction}
                  onChange={(e) => setActiveChecklist({ ...activeChecklist, activeConstruction: e.target.checked })}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span className="text-slate-200">Active Construction Activity Witnessed</span>
              </label>

              <label className="flex items-center space-x-2.5 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeChecklist.heavyMachineryPresent}
                  onChange={(e) => setActiveChecklist({ ...activeChecklist, heavyMachineryPresent: e.target.checked })}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span className="text-slate-200">Heavy Machinery / Excavator on Parcel</span>
              </label>

              <label className="flex items-center space-x-2.5 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeChecklist.noPermitBoardDisplayed}
                  onChange={(e) => setActiveChecklist({ ...activeChecklist, noPermitBoardDisplayed: e.target.checked })}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span className="text-slate-200">No Municipal Sanction Board Displayed</span>
              </label>

              <label className="flex items-center space-x-2.5 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeChecklist.rccPillarsErected}
                  onChange={(e) => setActiveChecklist({ ...activeChecklist, rccPillarsErected: e.target.checked })}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span className="text-slate-200">Reinforced Concrete (RCC) Stems Erected</span>
              </label>
            </div>

            {/* Structure Classification */}
            <div className="text-xs">
              <label className="text-slate-300 font-medium">Observed Structure Type</label>
              <input
                type="text"
                value={structureType}
                onChange={(e) => setStructureType(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Inspector Detailed Remarks */}
            <div className="text-xs">
              <label className="text-slate-300 font-medium">Divisional Revenue Inspector (DRI) Remarks</label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            {/* Statutory Recommendation */}
            <div className="text-xs">
              <label className="text-slate-300 font-medium">Recommended Statutory Action</label>
              <select
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value as any)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-medium text-xs"
              >
                <option value="issue_stop_work_notice">Issue Section 115 Stop-Work Notice (High Urgency)</option>
                <option value="schedule_demolition">Schedule Immediate Encroachment Demolition Order</option>
                <option value="regularization_possible">Regularization with Compounding Penalty Possible</option>
                <option value="case_closed">Close Case (Compliant with Sanctioned Blueprint)</option>
              </select>
            </div>

            {/* Voice Memo Simulator */}
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Mic className={`w-4 h-4 ${isRecordingVoice ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
                <span className="text-slate-300 font-medium">
                  {isRecordingVoice ? 'Recording field audio memo...' : voiceRecorded ? 'Audio memo recorded (48s - WAV)' : 'Voice Memo Recorder'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!isRecordingVoice) {
                    setIsRecordingVoice(true);
                    setTimeout(() => {
                      setIsRecordingVoice(false);
                      setVoiceRecorded(true);
                    }, 2000);
                  }
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
              >
                {isRecordingVoice ? 'Recording...' : voiceRecorded ? 'Re-record' : 'Record Memo'}
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-600/30 transition flex items-center space-x-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Syncing with PostGIS...' : 'Submit Ground-Truth Inspection'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Geotagged Field Photographs */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
                <Camera className="w-4 h-4 mr-1.5 text-emerald-400" />
                Geotagged On-Site Evidence
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">2 Photos Synced</span>
            </div>

            <div className="space-y-3 mt-3">
              <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 relative group">
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb186241b?w=600&auto=format&fit=crop&q=80"
                  alt="Field North Elevation"
                  className="w-full h-36 object-cover"
                />
                <div className="p-2.5 text-[11px] bg-slate-950">
                  <div className="font-semibold text-slate-200">
                    Photo 1: North Elevation Footprint
                  </div>
                  <div className="text-slate-400 text-[10px] mt-0.5 flex items-center justify-between">
                    <span>Azimuth: 18° NNE</span>
                    <span className="font-mono text-emerald-400">Lat: {location.latitude.toFixed(4)}°</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 relative group">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80"
                  alt="Field Concrete Machinery"
                  className="w-full h-36 object-cover"
                />
                <div className="p-2.5 text-[11px] bg-slate-950">
                  <div className="font-semibold text-slate-200">
                    Photo 2: Cement Batching on Agricultural Soil
                  </div>
                  <div className="text-slate-400 text-[10px] mt-0.5 flex items-center justify-between">
                    <span>Azimuth: 142° SE</span>
                    <span className="font-mono text-emerald-400">Lng: {location.longitude.toFixed(4)}°</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>EXIF Verification:</span>
              <span className="text-emerald-400 font-mono font-semibold">AUTHENTIC (GPS Tagged)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
