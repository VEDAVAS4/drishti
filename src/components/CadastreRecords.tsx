import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  FileSpreadsheet, 
  ShieldCheck, 
  MapPin, 
  User, 
  Landmark, 
  Check, 
  AlertTriangle,
  Clock,
  Layers
} from 'lucide-react';
import { GovernmentRecord, LocationRecord } from '../types';

interface CadastreRecordsProps {
  locations: LocationRecord[];
  govtRecords: Record<string, GovernmentRecord>;
  onSelectLocation: (location: LocationRecord) => void;
  onAddLocation: (loc: Partial<LocationRecord>) => Promise<void>;
}

export const CadastreRecords: React.FC<CadastreRecordsProps> = ({
  locations,
  govtRecords,
  onSelectLocation,
  onAddLocation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSurvey, setNewSurvey] = useState({
    locationName: '',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    mandal: 'Amaravati Central',
    village: 'Mandadam',
    surveyNumber: '',
    latitude: '16.5124',
    longitude: '80.5218',
    plotAreaSqm: '4500',
    priority: 'high' as const
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredLocations = locations.filter(loc => {
    const term = searchTerm.toLowerCase();
    const record = govtRecords[loc.id];
    return (
      loc.locationName.toLowerCase().includes(term) ||
      loc.surveyNumber.toLowerCase().includes(term) ||
      loc.district.toLowerCase().includes(term) ||
      record?.registeredOwnerName.toLowerCase().includes(term) ||
      record?.officialLandUse.toLowerCase().includes(term)
    );
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSurvey.surveyNumber || !newSurvey.latitude || !newSurvey.longitude) return;

    setIsSubmitting(true);
    try {
      await onAddLocation({
        locationName: newSurvey.locationName || `Plot Sy ${newSurvey.surveyNumber} (${newSurvey.district})`,
        state: newSurvey.state,
        district: newSurvey.district,
        mandal: newSurvey.mandal,
        village: newSurvey.village,
        surveyNumber: newSurvey.surveyNumber,
        latitude: parseFloat(newSurvey.latitude),
        longitude: parseFloat(newSurvey.longitude),
        plotAreaSqm: parseFloat(newSurvey.plotAreaSqm) || 4000,
        priority: newSurvey.priority
      });
      setShowAddModal(false);
      setNewSurvey({
        locationName: '',
        state: 'Andhra Pradesh',
        district: 'Guntur',
        mandal: 'Amaravati Central',
        village: 'Mandadam',
        surveyNumber: '',
        latitude: '16.5124',
        longitude: '80.5218',
        plotAreaSqm: '4500',
        priority: 'high'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-emerald-400 font-mono uppercase tracking-wider">
              State Land Registries Integration
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              AP Webland • TS Dharani • KA Bhoomi
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Cadastral Survey Records & Zoning Directory
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronized with Revenue Department Pahani, Record of Rights (ROR), Town Planning Master Plans, and Lake Buffer notifications.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search survey no, owner, zoning..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-600/20 transition shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Survey Plot</span>
          </button>
        </div>
      </div>

      {/* Cadastral Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLocations.map((loc) => {
          const record = govtRecords[loc.id];
          return (
            <div
              key={loc.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4.5 shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      {record?.recordSource.replace('_', ' ') || 'REVENUE DEPT'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                    Sy: {loc.surveyNumber}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-white mt-2.5 line-clamp-1">
                  {loc.locationName}
                </h3>
                <div className="flex items-center text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500 shrink-0" />
                  <span className="truncate">{loc.village}, {loc.mandal}, {loc.district}</span>
                </div>

                {/* Key Cadastral Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-3.5 text-xs">
                  <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Official Zoning</div>
                    <div className="font-semibold text-slate-200 capitalize mt-0.5 truncate">
                      {record?.officialLandUse.replace(/_/g, ' ') || 'Agricultural'}
                    </div>
                  </div>

                  <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Permitted FSI</div>
                    <div className="font-semibold text-slate-200 mt-0.5">
                      {record?.permittedFloors === 0 ? 'Zero / None' : `Max G+${record?.permittedFloors}`}
                    </div>
                  </div>
                </div>

                {/* Registered Owner & Patta */}
                <div className="mt-3 bg-slate-950/40 p-2 rounded-lg text-xs space-y-1">
                  <div className="flex items-center text-slate-300">
                    <User className="w-3 h-3 mr-1.5 text-slate-500" />
                    <span className="text-slate-400">Owner:</span>
                    <span className="font-medium text-slate-200 ml-1 truncate">
                      {record?.registeredOwnerName || 'Recorded Landholder'}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-400 text-[11px] font-mono">
                    <Landmark className="w-3 h-3 mr-1.5 text-slate-500" />
                    <span>Patta: {record?.pattaNumber || 'AP-ROR-44021'}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Area: <b className="text-slate-200">{loc.plotAreaSqm.toLocaleString()} m²</b>
                </span>
                <button
                  onClick={() => onSelectLocation(loc)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 rounded text-xs font-semibold transition"
                >
                  Inspect Satellite View →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Register New Cadastral Survey Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center">
                <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-400" />
                Register New Cadastral Survey Plot
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="text-slate-300 font-medium">Location / Area Name</label>
                <input
                  type="text"
                  placeholder="e.g. Amaravati Seed Access Road Plot 14"
                  value={newSurvey.locationName}
                  onChange={(e) => setNewSurvey({ ...newSurvey, locationName: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Survey Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 512/3B"
                    value={newSurvey.surveyNumber}
                    onChange={(e) => setNewSurvey({ ...newSurvey, surveyNumber: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">District</label>
                  <input
                    type="text"
                    value={newSurvey.district}
                    onChange={(e) => setNewSurvey({ ...newSurvey, district: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Latitude (WGS 84) *</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={newSurvey.latitude}
                    onChange={(e) => setNewSurvey({ ...newSurvey, latitude: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Longitude (WGS 84) *</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={newSurvey.longitude}
                    onChange={(e) => setNewSurvey({ ...newSurvey, longitude: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Cadastral Plot Area (m²)</label>
                  <input
                    type="number"
                    value={newSurvey.plotAreaSqm}
                    onChange={(e) => setNewSurvey({ ...newSurvey, plotAreaSqm: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Inspection Priority</label>
                  <select
                    value={newSurvey.priority}
                    onChange={(e) => setNewSurvey({ ...newSurvey, priority: e.target.value as any })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20"
                >
                  {isSubmitting ? 'Registering & Fetching Sentinel Tiles...' : 'Submit & Trigger Verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
