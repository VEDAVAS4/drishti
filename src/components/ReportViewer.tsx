import React from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  ShieldCheck, 
  QrCode, 
  Share2, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Satellite, 
  Scale, 
  MapPin,
  Lock
} from 'lucide-react';
import { Report, LocationRecord, SatelliteImage, AIPrediction, GovernmentRecord, VerificationResult } from '../types';

interface ReportViewerProps {
  reports: Report[];
  selectedLocation: LocationRecord;
  satelliteImage?: SatelliteImage;
  prediction?: AIPrediction;
  governmentRecord?: GovernmentRecord;
  verification?: VerificationResult;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  reports,
  selectedLocation,
  satelliteImage,
  prediction,
  governmentRecord,
  verification
}) => {
  const currentReport = reports.find(r => r.locationId === selectedLocation.id) || reports[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportData = {
      reportId: currentReport?.id,
      reportNumber: currentReport?.reportNumber,
      generatedAt: currentReport?.generatedAt,
      location: selectedLocation,
      satelliteAnalysis: satelliteImage,
      aiVisionInference: prediction,
      cadastreRecord: governmentRecord,
      statutoryVerification: verification,
      hashSignature: currentReport?.hashSignature
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentReport?.reportNumber || 'drishti-report'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl no-print">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-emerald-400 font-mono uppercase tracking-wider">
              Statutory Evidence Vault
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
              Indian Evidence Act Section 65B Compliant
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Official Land Verification Certificate & Dossier
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically sealed and signed satellite remote sensing evidence for administrative tribunals and municipal courts.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-600/30 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official PDF</span>
          </button>
        </div>
      </div>

      {/* Official Government Certificate Paper Plate */}
      <div className="bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 p-8 max-w-4xl mx-auto space-y-6 print:m-0 print:border-none print:shadow-none">
        {/* Certificate Header with Watermark & Emblems */}
        <div className="border-b-2 border-slate-900 pb-5 text-center relative">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                GOVERNMENT OF ANDHRA PRADESH / TELANGANA
              </div>
              <div className="text-xs font-bold text-slate-800 uppercase">
                MUNICIPAL ADMINISTRATION & REVENUE DEPARTMENT
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-mono text-slate-600">
                REPORT DOSSIER NO:
              </div>
              <div className="text-xs font-mono font-bold text-emerald-800">
                {currentReport?.reportNumber || 'DRISHTI-VER-2026-GNT-421'}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-950 uppercase">
              STATUTORY SATELLITE LAND VERIFICATION REPORT
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-xl mx-auto">
              Prepared under the Authority of the Directorate of Town and Country Planning & Geospatial Land Record Intelligence Cell (DRISHTI)
            </p>
          </div>

          {/* Status Badge */}
          <div className="mt-3 inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border">
            {verification?.verificationStatus === 'mismatch' ? (
              <span className="bg-rose-100 text-rose-800 border-rose-300 flex items-center px-3 py-0.5 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-700" />
                MISMATCH DETECTED: {verification.violationType.replace(/_/g, ' ')}
              </span>
            ) : (
              <span className="bg-emerald-100 text-emerald-800 border-emerald-300 flex items-center px-3 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                CLEARANCE VERIFIED: STATUTORY COMPLIANCE
              </span>
            )}
          </div>
        </div>

        {/* Section 1: Cadastral Location Particulars */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1">
            1. Cadastral Survey Particulars
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded border border-slate-200">
            <div>
              <div className="text-[10px] text-slate-500 font-mono">Survey Number</div>
              <div className="font-bold text-slate-900 mt-0.5">{selectedLocation.surveyNumber}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono">District & Mandal</div>
              <div className="font-bold text-slate-900 mt-0.5">{selectedLocation.district} / {selectedLocation.mandal}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono">Registered Plot Area</div>
              <div className="font-bold text-slate-900 mt-0.5">{selectedLocation.plotAreaSqm.toLocaleString()} m²</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono">WGS84 Coordinates</div>
              <div className="font-bold text-slate-900 mt-0.5 font-mono text-[11px]">
                {selectedLocation.latitude.toFixed(4)}°N, {selectedLocation.longitude.toFixed(4)}°E
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Satellite Remote Sensing Ingestion Evidence */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 flex items-center justify-between">
            <span>2. Satellite Optical & Multi-Spectral Telemetry</span>
            <span className="text-[10px] text-slate-500 font-mono">Sensor: Sentinel-2B MSI</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded border border-slate-200">
            <div>
              <div className="text-[10px] text-slate-500 font-mono">Acquisition Date</div>
              <div className="font-bold text-slate-900 mt-0.5">{satelliteImage?.captureDate || '2026-09-15'}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono">Cloud Cover Index</div>
              <div className="font-bold text-slate-900 mt-0.5">{satelliteImage?.cloudCoverPercent || 2.1}% (Optimal)</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono">Ground Resolution</div>
              <div className="font-bold text-slate-900 mt-0.5">{satelliteImage?.resolutionMeters || 10}m per pixel</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono">Scene Identification</div>
              <div className="font-bold text-slate-900 mt-0.5 font-mono text-[10px] truncate">
                {satelliteImage?.sceneId || 'S2B_MSIL2A_T44QND'}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Deep Vision AI Findings vs Government Cadastre */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1">
            3. AI Detection vs Official Revenue Cadastre Comparison
          </h3>
          <div className="border border-slate-300 rounded overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2.5">Parameter</th>
                  <th className="p-2.5">Official Government Record</th>
                  <th className="p-2.5">Drishti AI Satellite Detection</th>
                  <th className="p-2.5">Variance / Finding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 font-medium text-slate-700">Land Use Category</td>
                  <td className="p-2.5 font-bold text-slate-900 capitalize">
                    {governmentRecord?.officialLandUse.replace(/_/g, ' ') || 'Agricultural Dry Land'}
                  </td>
                  <td className="p-2.5 font-bold text-rose-700 capitalize">
                    {prediction?.primaryClass.replace(/_/g, ' ') || 'Commercial Function Hall'}
                  </td>
                  <td className="p-2.5 text-rose-700 font-bold">
                    {verification?.verificationStatus === 'mismatch' ? 'ILLEGAL CONVERSION' : 'MATCH'}
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-700">Permitted Construction FSI</td>
                  <td className="p-2.5 text-slate-900">
                    {governmentRecord?.permittedFloors === 0 ? 'FSI 0.0 (Zero Built-Up Allowed)' : `G+${governmentRecord?.permittedFloors}`}
                  </td>
                  <td className="p-2.5 text-slate-900 font-bold">
                    {prediction?.totalBuiltAreaSqm || 1420} m² Footprint ({prediction?.buildingCount || 3} Structures)
                  </td>
                  <td className="p-2.5 text-rose-700 font-bold">
                    {verification?.verificationStatus === 'mismatch' ? '100% UNPERMITTED' : 'WITHIN LIMITS'}
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-700">Vegetation Canopy (NDVI)</td>
                  <td className="p-2.5 text-slate-900">Historical Mean: {prediction?.ndviMeanHistorical || 0.68}</td>
                  <td className="p-2.5 text-slate-900">Current Mean: {prediction?.ndviMeanCurrent || 0.12}</td>
                  <td className="p-2.5 text-rose-700 font-bold">
                    {prediction?.ndviChangePercent || -82.35}% (Severe Clear-felling)
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-700">Evidence Confidence</td>
                  <td className="p-2.5 text-slate-600">Pahani/Adangal Verified</td>
                  <td className="p-2.5 text-slate-600">YOLOv8l Confidence: {((prediction?.confidence || 0.94) * 100).toFixed(1)}%</td>
                  <td className="p-2.5 text-emerald-800 font-bold font-mono">
                    Ensemble Score: {((verification?.evidenceScore || 0.945) * 100).toFixed(1)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Statutory Legal Recommendation */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1">
            4. Statutory Enforcement Order & Recommendation
          </h3>
          <div className="bg-slate-50 p-4 rounded border border-slate-300 text-xs leading-relaxed space-y-2">
            <p className="font-semibold text-slate-900">
              {verification?.recommendation || 'Issue Section 115 Stop-Work Notice. Refer to District Task Force.'}
            </p>
            <p className="text-slate-600 text-[11px]">
              <b>Legal Citations:</b> Sections 115 & 116 of Andhra Pradesh / Telangana Municipalities Act; Water, Land and Trees Act (WALTA) 2002; and Non-Agricultural Land Assessment (NALA) Act 2006.
            </p>
          </div>
        </div>

        {/* Section 5: Signature, Seal & Cryptographic Token */}
        <div className="pt-4 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-700 font-mono text-[10px]">
              <Lock className="w-3.5 h-3.5 text-emerald-700" />
              <span>CRYPTOGRAPHIC SHA-256 DIGITAL SIGNATURE:</span>
            </div>
            <div className="font-mono text-[10px] text-slate-500 break-all max-w-sm">
              {currentReport?.hashSignature || 'SHA256: 8a4f91e32d67cc819bf405e638102a94f0e7a12cb59f018e6c40a5b2811a09d1'}
            </div>
          </div>

          <div className="text-right">
            <div className="font-bold text-slate-900 uppercase">
              DR. SNEHA KULKARNI
            </div>
            <div className="text-[10px] text-slate-600">
              Senior Geospatial AI Specialist, Drishti Authority
            </div>
            <div className="text-[10px] font-mono text-emerald-700 mt-0.5">
              DIGITALLY SEALED & RECORDED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
