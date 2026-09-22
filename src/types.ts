/**
 * Drishti Geospatial Intelligence System - TypeScript Type Definitions
 */

export type UserRole = 'admin' | 'analyst' | 'field_officer' | 'citizen';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  avatar: string;
  badgeNumber: string;
}

export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'flagged' | 'error';

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface LocationRecord {
  id: string;
  locationName: string;
  state: string;
  district: string;
  mandal: string;
  village: string;
  surveyNumber: string;
  latitude: number;
  longitude: number;
  priority: PriorityLevel;
  status: ProcessingStatus;
  plotAreaSqm: number;
  bufferMeters: number;
  createdAt: string;
  updatedAt: string;
  geometryPolygon: LatLng[];
}

export type SatelliteProvider = 'sentinel2' | 'landsat8' | 'google_earth';

export interface SatelliteImage {
  id: string;
  locationId: string;
  provider: SatelliteProvider;
  imageUrl: string;
  historicalImageUrl: string;
  nirImageUrl: string;
  ndviImageUrl: string;
  captureDate: string;
  historicalCaptureDate: string;
  cloudCoverPercent: number;
  resolutionMeters: number;
  sceneId: string;
  bands: string[];
  sunElevationAngle: number;
}

export interface DetectedBoundingBox {
  id: string;
  label: 'building' | 'residential_structure' | 'commercial_structure' | 'construction_site' | 'temporary_shed';
  confidence: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  areaSqm: number;
  roofType?: string;
}

export interface AIPrediction {
  id: string;
  satelliteImageId: string;
  locationId: string;
  modelVersion: string;
  primaryClass: 'agricultural_land' | 'residential_settlement' | 'commercial_area' | 'industrial_area' | 'water_body' | 'forest' | 'vacant_land';
  confidence: number;
  detectedStructures: DetectedBoundingBox[];
  buildingCount: number;
  totalBuiltAreaSqm: number;
  landUseProbabilities: Record<string, number>;
  ndviMeanCurrent: number;
  ndviMeanHistorical: number;
  ndviChangePercent: number;
  temporalChangeDetected: boolean;
  processingTimeMs: number;
  inferenceTimestamp: string;
}

export type RecordSource = 'revenue_dept' | 'grhmc' | 'hmda' | 'bhu_bharati' | 'land_records_ap';

export interface GovernmentRecord {
  id: string;
  locationId: string;
  recordSource: RecordSource;
  officialLandUse: 'agricultural' | 'residential' | 'commercial' | 'industrial' | 'water_body_buffer' | 'recreational_green';
  registeredOwnerName: string;
  surveyNumber: string;
  subDivisionNumber: string;
  pattaNumber: string;
  plotAreaSqm: number;
  permittedFloors: number;
  zoningClassification: string;
  lastUpdated: string;
  revenueInspectorVerified: boolean;
  remarks: string;
}

export type VerificationStatus = 'verified' | 'mismatch' | 'needs_review' | 'inconclusive';

export type ViolationType = 
  | 'unauthorized_construction' 
  | 'land_use_violation' 
  | 'waterbody_encroachment' 
  | 'fsi_violation' 
  | 'none';

export interface VerificationResult {
  id: string;
  locationId: string;
  satelliteImageId: string;
  govtRecordId: string;
  verificationStatus: VerificationStatus;
  violationType: ViolationType;
  aiDetectedUse: string;
  officialRecordedUse: string;
  compatibilityScore: number; // 0 - 1
  spatialOverlapScore: number; // 0 - 1
  temporalAnomalyScore: number; // 0 - 1
  evidenceScore: number; // 0 - 1
  recommendation: string;
  verifiedAt: string;
  verifiedBy: string;
  notes: string;
}

export interface GroundTruthInspection {
  id: string;
  locationId: string;
  inspectorId: string;
  inspectorName: string;
  inspectionDate: string;
  gpsCoordinates: LatLng;
  gpsAccuracyMeters: number;
  constructionActive: boolean;
  observedStructureType: string;
  estimatedCompletionPercent: number;
  geotaggedPhotos: {
    id: string;
    caption: string;
    url: string;
    azimuthDegrees: number;
  }[];
  officerRemarks: string;
  recommendedAction: 'issue_stop_work_notice' | 'schedule_demolition' | 'regularization_possible' | 'case_closed';
}

export interface Report {
  id: string;
  reportNumber: string;
  verificationId: string;
  locationId: string;
  generatedAt: string;
  generatedBy: string;
  title: string;
  summary: string;
  violationType: ViolationType;
  verificationStatus: VerificationStatus;
  evidenceScore: number;
  hashSignature: string;
  qrCodeToken: string;
}

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'AUDIT';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userId?: string;
}

export interface SystemMetrics {
  totalLocations: number;
  totalVerifications: number;
  violationsDetected: number;
  activeProcessingCount: number;
  avgModelInferenceMs: number;
  systemUptimeSeconds: number;
  satelliteScenesIngested: number;
  apiSuccessRate: number;
}
