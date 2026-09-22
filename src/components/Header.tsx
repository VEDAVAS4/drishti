import React from 'react';
import { 
  Radar, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Activity, 
  ChevronDown,
  UserCheck,
  AlertTriangle,
  FileCheck2
} from 'lucide-react';
import { User, LocationRecord, VerificationResult } from '../types';
import { MOCK_USERS } from '../data/mockData';

interface HeaderProps {
  currentUser: User;
  onSelectUser: (user: User) => void;
  locations: LocationRecord[];
  selectedLocation: LocationRecord;
  onSelectLocation: (location: LocationRecord) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCopilot: () => void;
  verification?: VerificationResult;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSelectUser,
  locations,
  selectedLocation,
  onSelectLocation,
  activeTab,
  onSelectTab,
  onOpenCopilot,
  verification
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = React.useState(false);

  const navItems = [
    { id: 'map', label: 'Geospatial Map' },
    { id: 'pipeline', label: '7-Stage Pipeline' },
    { id: 'cadastre', label: 'Revenue Cadastre' },
    { id: 'field', label: 'Ground Truth Inspection' },
    { id: 'reports', label: 'Evidence Reports' },
    { id: 'telemetry', label: 'Logs & Metrics' },
    { id: 'tests', label: 'Automated Tests' },
    { id: 'docs', label: 'Architecture & Docs' },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Banner / Status Line */}
      <div className="bg-slate-900/80 border-b border-slate-800/80 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium tracking-wide">Sentinel-2B Telemetry: LIVE</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">Sun Orbit Pass: T44QND (Indian Peninsula)</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-mono">PostGIS v3.3 Spatial Engine: Ready</span>
        </div>

        <div className="flex items-center space-x-3">
          {verification && (
            <div className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1 ${
              verification.verificationStatus === 'mismatch'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {verification.verificationStatus === 'mismatch' ? (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  <span>{verification.violationType.toUpperCase().replace(/_/g, ' ')}</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-3 h-3 mr-1" />
                  <span>COMPLIANT STATUS VERIFIED</span>
                </>
              )}
            </div>
          )}
          <button
            onClick={onOpenCopilot}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 transition-colors font-medium text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Legal Copilot</span>
          </button>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
            <Radar className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-extrabold tracking-tight text-white flex items-center">
                DRISHTI <span className="ml-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">v2.4</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Satellite Imagery & Cadastral Land Verification Platform
            </p>
          </div>
        </div>

        {/* Location Selector */}
        <div className="relative">
          <button
            onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 hover:border-slate-700 transition text-xs font-medium max-w-[280px] sm:max-w-xs"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{selectedLocation.locationName}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
              Sy: {selectedLocation.surveyNumber}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {locationDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                Select Cadastral Site
              </div>
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    onSelectLocation(loc);
                    setLocationDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 transition ${
                    loc.id === selectedLocation.id ? 'bg-emerald-500/10 text-emerald-300 font-semibold' : 'text-slate-300'
                  }`}
                >
                  <div className="truncate">
                    <div className="truncate">{loc.locationName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Survey: {loc.surveyNumber} • {loc.district}</div>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold shrink-0 ${
                    loc.status === 'flagged' ? 'bg-rose-500/20 text-rose-300' :
                    loc.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    {loc.status}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center space-x-2.5 px-3 py-1.5 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-lg text-left transition"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-700"
            />
            <div className="hidden lg:block text-xs">
              <div className="text-slate-200 font-semibold flex items-center space-x-1">
                <span>{currentUser.name}</span>
                <span className="text-[9px] uppercase px-1 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                  {currentUser.role}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                {currentUser.roleTitle}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
                <span>Switch Role (RBAC)</span>
                <UserCheck className="w-3 h-3 text-slate-400" />
              </div>
              {MOCK_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    onSelectUser(user);
                    setUserDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center space-x-2.5 hover:bg-slate-800 transition ${
                    user.id === currentUser.id ? 'bg-indigo-500/10 text-indigo-300 font-semibold' : 'text-slate-300'
                  }`}
                >
                  <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                  <div className="truncate">
                    <div className="flex items-center space-x-1.5">
                      <span className="truncate">{user.name}</span>
                      <span className="text-[9px] uppercase px-1 rounded bg-slate-800 text-slate-400 font-mono">
                        {user.role}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{user.roleTitle}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950 px-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-2 py-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === item.id
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
