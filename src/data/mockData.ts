import { 
  User, 
  LocationRecord, 
  SatelliteImage, 
  AIPrediction, 
  GovernmentRecord, 
  VerificationResult, 
  GroundTruthInspection, 
  Report,
  LogEntry
} from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'usr_admin_01',
    name: 'Dr. A. V. Rao, IAS',
    email: 'commissioner@drishti.gov.in',
    role: 'admin',
    roleTitle: 'Spl. Chief Secretary & Commissioner',
    department: 'Municipal Administration & Urban Development (MA&UD)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    badgeNumber: 'GOV-AP-9941'
  },
  {
    id: 'usr_analyst_01',
    name: 'Dr. Sneha Kulkarni',
    email: 'sneha.k@isro-nrsc.res.in',
    role: 'analyst',
    roleTitle: 'Senior Geospatial AI Specialist',
    department: 'Geospatial Intelligence & Remote Sensing Cell',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    badgeNumber: 'GEO-NRSC-4820'
  },
  {
    id: 'usr_field_01',
    name: 'K. V. Naidu',
    email: 'kv.naidu@revenue.gov.in',
    role: 'field_officer',
    roleTitle: 'Divisional Revenue Inspector (DRI)',
    department: 'Ground Verification & Enforcement Wing',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    badgeNumber: 'REV-ENF-7109'
  },
  {
    id: 'usr_citizen_01',
    name: 'Meera Sharma',
    email: 'meera.vigilance@citizens.org',
    role: 'citizen',
    roleTitle: 'Citizen Land Watch Auditor',
    department: 'Public Land Transparency Forum',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    badgeNumber: 'PUB-AUDIT-1204'
  }
];

export const MOCK_LOCATIONS: LocationRecord[] = [
  {
    id: 'loc_guntur_421',
    locationName: 'Guntur Rural - Pedakakani Bypass',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    mandal: 'Pedakakani',
    village: 'Kaza',
    surveyNumber: '421/2B',
    latitude: 16.3475,
    longitude: 80.5212,
    priority: 'critical',
    status: 'flagged',
    plotAreaSqm: 5400,
    bufferMeters: 75,
    createdAt: '2026-09-10T08:30:00Z',
    updatedAt: '2026-09-20T14:15:00Z',
    geometryPolygon: [
      { lat: 16.3482, lng: 80.5204 },
      { lat: 16.3486, lng: 80.5222 },
      { lat: 16.3468, lng: 80.5226 },
      { lat: 16.3464, lng: 80.5208 }
    ]
  },
  {
    id: 'loc_hyd_88',
    locationName: 'Serilingampally - Durgam Cheruvu Buffer Zone',
    state: 'Telangana',
    district: 'Hyderabad',
    mandal: 'Serilingampally',
    village: 'Raidurgam',
    surveyNumber: '88/A',
    latitude: 17.4338,
    longitude: 78.3854,
    priority: 'critical',
    status: 'flagged',
    plotAreaSqm: 3850,
    bufferMeters: 50,
    createdAt: '2026-09-12T09:45:00Z',
    updatedAt: '2026-09-21T11:20:00Z',
    geometryPolygon: [
      { lat: 17.4345, lng: 78.3846 },
      { lat: 17.4349, lng: 78.3862 },
      { lat: 17.4331, lng: 78.3865 },
      { lat: 17.4328, lng: 78.3849 }
    ]
  },
  {
    id: 'loc_amaravati_114',
    locationName: 'Amaravati Capital City - Sector 4 (Thullur)',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    mandal: 'Thullur',
    village: 'Lingayapalem',
    surveyNumber: '114/4',
    latitude: 16.5367,
    longitude: 80.5189,
    priority: 'medium',
    status: 'completed',
    plotAreaSqm: 2400,
    bufferMeters: 40,
    createdAt: '2026-09-05T10:15:00Z',
    updatedAt: '2026-09-18T16:00:00Z',
    geometryPolygon: [
      { lat: 16.5372, lng: 80.5182 },
      { lat: 16.5375, lng: 80.5198 },
      { lat: 16.5361, lng: 80.5201 },
      { lat: 16.5358, lng: 80.5185 }
    ]
  },
  {
    id: 'loc_bengaluru_209',
    locationName: 'Devanahalli Airport Agro-Corridor',
    state: 'Karnataka',
    district: 'Bengaluru Rural',
    mandal: 'Devanahalli',
    village: 'Binnamangala',
    surveyNumber: '209/3',
    latitude: 13.2422,
    longitude: 77.7188,
    priority: 'high',
    status: 'flagged',
    plotAreaSqm: 8200,
    bufferMeters: 100,
    createdAt: '2026-09-08T12:00:00Z',
    updatedAt: '2026-09-19T09:30:00Z',
    geometryPolygon: [
      { lat: 13.2431, lng: 77.7176 },
      { lat: 13.2435, lng: 77.7202 },
      { lat: 13.2412, lng: 77.7205 },
      { lat: 13.2409, lng: 77.7179 }
    ]
  },
  {
    id: 'loc_pune_64',
    locationName: 'Hinjewadi Phase 3 Eco-Buffer',
    state: 'Maharashtra',
    district: 'Pune',
    mandal: 'Mulshi',
    village: 'Maan',
    surveyNumber: '64/B',
    latitude: 18.5833,
    longitude: 73.6892,
    priority: 'high',
    status: 'processing',
    plotAreaSqm: 6100,
    bufferMeters: 60,
    createdAt: '2026-09-16T14:30:00Z',
    updatedAt: '2026-09-21T07:10:00Z',
    geometryPolygon: [
      { lat: 18.5841, lng: 73.6881 },
      { lat: 18.5844, lng: 73.6904 },
      { lat: 18.5824, lng: 73.6907 },
      { lat: 18.5821, lng: 73.6884 }
    ]
  }
];

export const MOCK_SATELLITE_IMAGES: Record<string, SatelliteImage> = {
  loc_guntur_421: {
    id: 'sat_guntur_01',
    locationId: 'loc_guntur_421',
    provider: 'sentinel2',
    imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80', // High-res satellite look
    historicalImageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80', // Lush agricultural field
    nirImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80', // False-color infrared
    ndviImageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80', // Heatmap
    captureDate: '2026-09-15',
    historicalCaptureDate: '2025-09-10',
    cloudCoverPercent: 2.1,
    resolutionMeters: 10,
    sceneId: 'S2B_MSIL2A_20260915T051649_N0500_R019_T44QND',
    bands: ['B02 (Blue)', 'B03 (Green)', 'B04 (Red)', 'B08 (NIR)', 'B11 (SWIR)'],
    sunElevationAngle: 62.4
  },
  loc_hyd_88: {
    id: 'sat_hyd_02',
    locationId: 'loc_hyd_88',
    provider: 'sentinel2',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    historicalImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    nirImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    ndviImageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
    captureDate: '2026-09-18',
    historicalCaptureDate: '2025-11-04',
    cloudCoverPercent: 4.8,
    resolutionMeters: 10,
    sceneId: 'S2A_MSIL2A_20260918T052651_N0500_R062_T44QKE',
    bands: ['B02', 'B03', 'B04', 'B08', 'B12'],
    sunElevationAngle: 60.1
  },
  loc_amaravati_114: {
    id: 'sat_amaravati_03',
    locationId: 'loc_amaravati_114',
    provider: 'sentinel2',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=800&auto=format&fit=crop&q=80',
    historicalImageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    nirImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    ndviImageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
    captureDate: '2026-09-12',
    historicalCaptureDate: '2025-08-15',
    cloudCoverPercent: 1.5,
    resolutionMeters: 10,
    sceneId: 'S2B_MSIL2A_20260912T051649_N0500_R019_T44QND',
    bands: ['B02', 'B03', 'B04', 'B08'],
    sunElevationAngle: 63.8
  },
  loc_bengaluru_209: {
    id: 'sat_blr_04',
    locationId: 'loc_bengaluru_209',
    provider: 'sentinel2',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    historicalImageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    nirImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    ndviImageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
    captureDate: '2026-09-14',
    historicalCaptureDate: '2025-10-01',
    cloudCoverPercent: 3.2,
    resolutionMeters: 10,
    sceneId: 'S2B_MSIL2A_20260914T053649_N0500_R105_T43PGM',
    bands: ['B02', 'B03', 'B04', 'B08'],
    sunElevationAngle: 61.9
  },
  loc_pune_64: {
    id: 'sat_pune_05',
    locationId: 'loc_pune_64',
    provider: 'sentinel2',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186241b?w=800&auto=format&fit=crop&q=80',
    historicalImageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    nirImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    ndviImageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
    captureDate: '2026-09-16',
    historicalCaptureDate: '2026-06-15',
    cloudCoverPercent: 5.5,
    resolutionMeters: 10,
    sceneId: 'S2A_MSIL2A_20260916T054651_N0500_R019_T43PCP',
    bands: ['B02', 'B03', 'B04', 'B08'],
    sunElevationAngle: 58.7
  }
};

export const MOCK_AI_PREDICTIONS: Record<string, AIPrediction> = {
  loc_guntur_421: {
    id: 'ai_guntur_01',
    satelliteImageId: 'sat_guntur_01',
    locationId: 'loc_guntur_421',
    modelVersion: 'YOLOv8l-Drishti-SatBuild-v2.4',
    primaryClass: 'commercial_area',
    confidence: 0.942,
    buildingCount: 3,
    totalBuiltAreaSqm: 1420,
    detectedStructures: [
      {
        id: 'bb_01',
        label: 'commercial_structure',
        confidence: 0.94,
        x: 28,
        y: 32,
        width: 38,
        height: 34,
        areaSqm: 980,
        roofType: 'Industrial Sheet / Reinforced Concrete'
      },
      {
        id: 'bb_02',
        label: 'temporary_shed',
        confidence: 0.88,
        x: 70,
        y: 45,
        width: 18,
        height: 22,
        areaSqm: 260,
        roofType: 'Asbestos / Corrugated Steel'
      },
      {
        id: 'bb_03',
        label: 'construction_site',
        confidence: 0.91,
        x: 35,
        y: 72,
        width: 25,
        height: 18,
        areaSqm: 180,
        roofType: 'Foundation Footing / Pillar Stems'
      }
    ],
    landUseProbabilities: {
      commercial_area: 0.87,
      industrial_area: 0.08,
      agricultural_land: 0.03,
      residential_settlement: 0.02
    },
    ndviMeanCurrent: 0.12,
    ndviMeanHistorical: 0.68,
    ndviChangePercent: -82.35,
    temporalChangeDetected: true,
    processingTimeMs: 412,
    inferenceTimestamp: '2026-09-15T09:40:12Z'
  },
  loc_hyd_88: {
    id: 'ai_hyd_02',
    satelliteImageId: 'sat_hyd_02',
    locationId: 'loc_hyd_88',
    modelVersion: 'YOLOv8l-Drishti-SatBuild-v2.4',
    primaryClass: 'commercial_area',
    confidence: 0.915,
    buildingCount: 2,
    totalBuiltAreaSqm: 1850,
    detectedStructures: [
      {
        id: 'bb_hyd_01',
        label: 'commercial_structure',
        confidence: 0.92,
        x: 30,
        y: 25,
        width: 44,
        height: 48,
        areaSqm: 1450,
        roofType: 'Cast In-Situ Concrete Slab'
      },
      {
        id: 'bb_hyd_02',
        label: 'construction_site',
        confidence: 0.89,
        x: 76,
        y: 35,
        width: 18,
        height: 30,
        areaSqm: 400,
        roofType: 'Deep Earth Excavation & Retaining Wall'
      }
    ],
    landUseProbabilities: {
      commercial_area: 0.84,
      water_body: 0.12,
      vacant_land: 0.04
    },
    ndviMeanCurrent: 0.09,
    ndviMeanHistorical: 0.44,
    ndviChangePercent: -79.54,
    temporalChangeDetected: true,
    processingTimeMs: 468,
    inferenceTimestamp: '2026-09-18T10:14:02Z'
  },
  loc_amaravati_114: {
    id: 'ai_amaravati_03',
    satelliteImageId: 'sat_amaravati_03',
    locationId: 'loc_amaravati_114',
    modelVersion: 'YOLOv8l-Drishti-SatBuild-v2.4',
    primaryClass: 'residential_settlement',
    confidence: 0.884,
    buildingCount: 1,
    totalBuiltAreaSqm: 420,
    detectedStructures: [
      {
        id: 'bb_amr_01',
        label: 'residential_structure',
        confidence: 0.88,
        x: 38,
        y: 40,
        width: 26,
        height: 28,
        areaSqm: 420,
        roofType: 'Terrace Concrete'
      }
    ],
    landUseProbabilities: {
      residential_settlement: 0.89,
      vacant_land: 0.08,
      commercial_area: 0.03
    },
    ndviMeanCurrent: 0.28,
    ndviMeanHistorical: 0.32,
    ndviChangePercent: -12.5,
    temporalChangeDetected: false,
    processingTimeMs: 380,
    inferenceTimestamp: '2026-09-12T11:02:15Z'
  },
  loc_bengaluru_209: {
    id: 'ai_blr_04',
    satelliteImageId: 'sat_blr_04',
    locationId: 'loc_bengaluru_209',
    modelVersion: 'YOLOv8l-Drishti-SatBuild-v2.4',
    primaryClass: 'industrial_area',
    confidence: 0.958,
    buildingCount: 2,
    totalBuiltAreaSqm: 3200,
    detectedStructures: [
      {
        id: 'bb_blr_01',
        label: 'commercial_structure',
        confidence: 0.96,
        x: 20,
        y: 22,
        width: 55,
        height: 52,
        areaSqm: 2800,
        roofType: 'Steel Truss Pre-engineered Warehouse'
      },
      {
        id: 'bb_blr_02',
        label: 'temporary_shed',
        confidence: 0.86,
        x: 78,
        y: 50,
        width: 16,
        height: 22,
        areaSqm: 400,
        roofType: 'Security & Logistics Cabins'
      }
    ],
    landUseProbabilities: {
      industrial_area: 0.92,
      commercial_area: 0.06,
      agricultural_land: 0.02
    },
    ndviMeanCurrent: 0.14,
    ndviMeanHistorical: 0.72,
    ndviChangePercent: -80.55,
    temporalChangeDetected: true,
    processingTimeMs: 445,
    inferenceTimestamp: '2026-09-14T14:22:31Z'
  },
  loc_pune_64: {
    id: 'ai_pune_05',
    satelliteImageId: 'sat_pune_05',
    locationId: 'loc_pune_64',
    modelVersion: 'YOLOv8l-Drishti-SatBuild-v2.4',
    primaryClass: 'vacant_land',
    confidence: 0.782,
    buildingCount: 1,
    totalBuiltAreaSqm: 350,
    detectedStructures: [
      {
        id: 'bb_pune_01',
        label: 'construction_site',
        confidence: 0.78,
        x: 42,
        y: 44,
        width: 32,
        height: 30,
        areaSqm: 350,
        roofType: 'Early Earthmoving & Trenching'
      }
    ],
    landUseProbabilities: {
      vacant_land: 0.62,
      commercial_area: 0.28,
      forest: 0.10
    },
    ndviMeanCurrent: 0.22,
    ndviMeanHistorical: 0.65,
    ndviChangePercent: -66.15,
    temporalChangeDetected: true,
    processingTimeMs: 512,
    inferenceTimestamp: '2026-09-16T15:35:48Z'
  }
};

export const MOCK_GOVT_RECORDS: Record<string, GovernmentRecord> = {
  loc_guntur_421: {
    id: 'gov_guntur_01',
    locationId: 'loc_guntur_421',
    recordSource: 'revenue_dept',
    officialLandUse: 'agricultural',
    registeredOwnerName: 'M. Rama Rao & Brothers',
    surveyNumber: '421/2B',
    subDivisionNumber: 'Part-2',
    pattaNumber: 'AP-GNT-10992',
    plotAreaSqm: 5400,
    permittedFloors: 0,
    zoningClassification: 'Agri-Zone (Dry Crop / Chillies)',
    lastUpdated: '2023-11-20',
    revenueInspectorVerified: true,
    remarks: 'Strictly restricted to agricultural cultivation. No conversion to NALA (Non-Agricultural Land Assessment) approved.'
  },
  loc_hyd_88: {
    id: 'gov_hyd_02',
    locationId: 'loc_hyd_88',
    recordSource: 'hmda',
    officialLandUse: 'water_body_buffer',
    registeredOwnerName: 'State Government Lake Conservation Catchment',
    surveyNumber: '88/A',
    subDivisionNumber: 'Buffer-1',
    pattaNumber: 'HMDA-WBB-0042',
    plotAreaSqm: 3850,
    permittedFloors: 0,
    zoningClassification: 'Full Tank Level (FTL) 30m Green Buffer',
    lastUpdated: '2024-02-14',
    revenueInspectorVerified: true,
    remarks: 'Strict Zero-Construction Zone under High Court PIL & WALTA Act. Commercial structures strictly prohibited.'
  },
  loc_amaravati_114: {
    id: 'gov_amaravati_03',
    locationId: 'loc_amaravati_114',
    recordSource: 'bhu_bharati',
    officialLandUse: 'residential',
    registeredOwnerName: 'Smt. K. Lakshmi Bhavani',
    surveyNumber: '114/4',
    subDivisionNumber: 'Plot-28',
    pattaNumber: 'AP-CRDA-RES-8821',
    plotAreaSqm: 2400,
    permittedFloors: 2,
    zoningClassification: 'Residential Zone R-1 (Low-Density)',
    lastUpdated: '2025-05-18',
    revenueInspectorVerified: true,
    remarks: 'Approved building permission APCRDA/BP/2025/1102. Residential G+1 sanctioned.'
  },
  loc_bengaluru_209: {
    id: 'gov_bengaluru_04',
    locationId: 'loc_bengaluru_209',
    recordSource: 'revenue_dept',
    officialLandUse: 'recreational_green',
    registeredOwnerName: 'G. Narayanaswamy Heirs',
    surveyNumber: '209/3',
    subDivisionNumber: 'A-3',
    pattaNumber: 'KA-BLR-DEV-4431',
    plotAreaSqm: 8200,
    permittedFloors: 0,
    zoningClassification: 'BIAAPA Master Plan Green Belt / Agro-Forestry',
    lastUpdated: '2023-08-11',
    revenueInspectorVerified: true,
    remarks: 'Commercial warehouse setup is in direct breach of BIAAPA Master Plan 2031.'
  },
  loc_pune_64: {
    id: 'gov_pune_05',
    locationId: 'loc_pune_64',
    recordSource: 'grhmc',
    officialLandUse: 'agricultural',
    registeredOwnerName: 'Patil Agricultural Syndicate',
    surveyNumber: '64/B',
    subDivisionNumber: 'P-1',
    pattaNumber: 'MH-PUN-MUL-990',
    plotAreaSqm: 6100,
    permittedFloors: 0,
    zoningClassification: 'Rural Agricultural Buffer Zone',
    lastUpdated: '2024-06-02',
    revenueInspectorVerified: false,
    remarks: 'No non-agricultural (NA) industrial clearance on record.'
  }
};

export const MOCK_VERIFICATIONS: Record<string, VerificationResult> = {
  loc_guntur_421: {
    id: 'ver_guntur_01',
    locationId: 'loc_guntur_421',
    satelliteImageId: 'sat_guntur_01',
    govtRecordId: 'gov_guntur_01',
    verificationStatus: 'mismatch',
    violationType: 'unauthorized_construction',
    aiDetectedUse: 'Commercial Function Hall & Steel Warehouse (1,420 m²)',
    officialRecordedUse: 'Agricultural Dry Crop (Agri-Zone)',
    compatibilityScore: 0.08,
    spatialOverlapScore: 0.94,
    temporalAnomalyScore: 0.88,
    evidenceScore: 0.945,
    recommendation: 'Urgent Enforcement: Issue Section 115 Stop-Work Notice. Refer to Joint Collector & District Task Force.',
    verifiedAt: '2026-09-15T10:05:00Z',
    verifiedBy: 'Dr. Sneha Kulkarni',
    notes: 'Multi-spectral satellite analysis confirms major concrete structure and parking shed erected without NALA land conversion.'
  },
  loc_hyd_88: {
    id: 'ver_hyd_02',
    locationId: 'loc_hyd_88',
    satelliteImageId: 'sat_hyd_02',
    govtRecordId: 'gov_hyd_02',
    verificationStatus: 'mismatch',
    violationType: 'waterbody_encroachment',
    aiDetectedUse: 'Multi-story Commercial Excavation & Structure (1,850 m²)',
    officialRecordedUse: 'Water Body 30m FTL Conservation Buffer (HMDA)',
    compatibilityScore: 0.02,
    spatialOverlapScore: 0.97,
    temporalAnomalyScore: 0.94,
    evidenceScore: 0.982,
    recommendation: 'Immediate Demolition Order: Severe violation of WALTA Act. Forward coordinates to HYDRAA enforcement squad.',
    verifiedAt: '2026-09-18T10:45:00Z',
    verifiedBy: 'Dr. A. V. Rao, IAS',
    notes: 'High spatial overlap within 30-meter lake buffer. Excavation threatens flood spillway.'
  },
  loc_amaravati_114: {
    id: 'ver_amaravati_03',
    locationId: 'loc_amaravati_114',
    satelliteImageId: 'sat_amaravati_03',
    govtRecordId: 'gov_amaravati_03',
    verificationStatus: 'verified',
    violationType: 'none',
    aiDetectedUse: 'Residential Dwelling G+1 (420 m²)',
    officialRecordedUse: 'Residential Zone R-1 (Permitted G+1)',
    compatibilityScore: 0.96,
    spatialOverlapScore: 0.92,
    temporalAnomalyScore: 0.12,
    evidenceScore: 0.935,
    recommendation: 'Compliance Approved: Structure matches registered building sanction footprint with correct side setbacks.',
    verifiedAt: '2026-09-12T11:40:00Z',
    verifiedBy: 'Dr. Sneha Kulkarni',
    notes: 'No unauthorized deviations detected. Ground footprint within sanctioned 450 m² maximum.'
  },
  loc_bengaluru_209: {
    id: 'ver_bengaluru_04',
    locationId: 'loc_bengaluru_209',
    satelliteImageId: 'sat_blr_04',
    govtRecordId: 'gov_bengaluru_04',
    verificationStatus: 'mismatch',
    violationType: 'land_use_violation',
    aiDetectedUse: 'Industrial Logistics Shed & Heavy Bay (3,200 m²)',
    officialRecordedUse: 'BIAAPA Master Plan Green Belt / Agro-Forestry',
    compatibilityScore: 0.15,
    spatialOverlapScore: 0.91,
    temporalAnomalyScore: 0.85,
    evidenceScore: 0.912,
    recommendation: 'Issue Notice under KTCP Act Section 76. Seal premises pending tribunal review.',
    verifiedAt: '2026-09-14T15:10:00Z',
    verifiedBy: 'Dr. Sneha Kulkarni',
    notes: 'Massive NDVI drop from 0.72 to 0.14 confirms clear-felling of agro-forestry trees for metal warehouse.'
  },
  loc_pune_64: {
    id: 'ver_pune_05',
    locationId: 'loc_pune_64',
    satelliteImageId: 'sat_pune_05',
    govtRecordId: 'gov_pune_05',
    verificationStatus: 'needs_review',
    violationType: 'unauthorized_construction',
    aiDetectedUse: 'Earth Excavation & Heavy Machine Footprint (350 m²)',
    officialRecordedUse: 'Rural Agricultural Buffer Zone',
    compatibilityScore: 0.35,
    spatialOverlapScore: 0.78,
    temporalAnomalyScore: 0.72,
    evidenceScore: 0.765,
    recommendation: 'Dispatch Field Verification Officer with Drone Camera for on-site inspection.',
    verifiedAt: '2026-09-16T16:00:00Z',
    verifiedBy: 'K. V. Naidu',
    notes: 'Incipient ground activity detected. Ground verification required before issuing formal penalty.'
  }
};

export const MOCK_FIELD_INSPECTIONS: Record<string, GroundTruthInspection> = {
  loc_guntur_421: {
    id: 'insp_gnt_01',
    locationId: 'loc_guntur_421',
    inspectorId: 'usr_field_01',
    inspectorName: 'K. V. Naidu (DRI)',
    inspectionDate: '2026-09-17T11:20:00Z',
    gpsCoordinates: { lat: 16.3478, lng: 80.5215 },
    gpsAccuracyMeters: 2.8,
    constructionActive: true,
    observedStructureType: 'Commercial Function Hall with RCC Pillars & Steel Roof',
    estimatedCompletionPercent: 78,
    geotaggedPhotos: [
      {
        id: 'photo_01',
        caption: 'North elevation showing unauthorized 30-ft ceiling height',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186241b?w=600&auto=format&fit=crop&q=80',
        azimuthDegrees: 18
      },
      {
        id: 'photo_02',
        caption: 'Cement mixers and gravel stockpiles on agricultural parcel',
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
        azimuthDegrees: 142
      }
    ],
    officerRemarks: 'Ground reality matches satellite AI warning 100%. Site manager failed to produce any sanctioned building plan or NALA conversion challan. Construction ongoing despite verbal warning.',
    recommendedAction: 'issue_stop_work_notice'
  }
};

export const MOCK_REPORTS: Report[] = [
  {
    id: 'rep_drishti_001',
    reportNumber: 'DRISHTI-VER-2026-GNT-421',
    verificationId: 'ver_guntur_01',
    locationId: 'loc_guntur_421',
    generatedAt: '2026-09-15T10:15:30Z',
    generatedBy: 'Dr. Sneha Kulkarni',
    title: 'Statutory Violation Report: Unauthorized Commercial Development on Agricultural Parcel 421/2B',
    summary: 'Multi-temporal Sentinel-2 optical imagery combined with YOLOv8 structure detection has identified 1,420 m² of non-permitted commercial construction on agricultural dry land. Spatial overlap with Revenue Department Cadastral Record AP-GNT-10992 confirms 0% FSI allowance.',
    violationType: 'unauthorized_construction',
    verificationStatus: 'mismatch',
    evidenceScore: 0.945,
    hashSignature: 'SHA256: 8a4f91e32d67cc819bf405e638102a94f0e7a12cb59f018e6c40a5b2811a09d1',
    qrCodeToken: 'DRISHTI-VERIFY-AP-GNT-421-20260915'
  },
  {
    id: 'rep_drishti_002',
    reportNumber: 'DRISHTI-VER-2026-HYD-088',
    verificationId: 'ver_hyd_02',
    locationId: 'loc_hyd_88',
    generatedAt: '2026-09-18T11:00:15Z',
    generatedBy: 'Dr. A. V. Rao, IAS',
    title: 'Statutory Violation Report: Encroachment in Durgam Cheruvu 30m Waterbody Buffer',
    summary: 'High-confidence AI prediction reveals commercial excavation and RCC pillars encroaching directly into the designated 30m Full Tank Level (FTL) lake buffer. WALTA Act violation confirmed.',
    violationType: 'waterbody_encroachment',
    verificationStatus: 'mismatch',
    evidenceScore: 0.982,
    hashSignature: 'SHA256: 3c91b72e90f14a6e812d45c89201948ba5e421cd7801826f5d8129e019f4a132',
    qrCodeToken: 'DRISHTI-VERIFY-TS-HYD-088-20260918'
  },
  {
    id: 'rep_drishti_003',
    reportNumber: 'DRISHTI-VER-2026-AMR-114',
    verificationId: 'ver_amaravati_03',
    locationId: 'loc_amaravati_114',
    generatedAt: '2026-09-12T12:05:00Z',
    generatedBy: 'Dr. Sneha Kulkarni',
    title: 'Compliance Clearance Certificate: Residential Development Survey 114/4',
    summary: 'Satellite optical comparison against APCRDA Sector 4 Master Plan confirms full statutory compliance. Setbacks, built-up footprint (420 m²), and residential classification align with sanctioned plan.',
    violationType: 'none',
    verificationStatus: 'verified',
    evidenceScore: 0.935,
    hashSignature: 'SHA256: 7e201a4f89b14c3309e72810a9f5d18e24c017bb4920163fa9081e7d235c1044',
    qrCodeToken: 'DRISHTI-CLEAR-AP-AMR-114-20260912'
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log_01',
    timestamp: '2026-09-21T17:45:10Z',
    level: 'INFO',
    service: 'drishti-core-gateway',
    message: 'PostGIS spatial cluster connected: PostgreSQL 15.4 with GEOS 3.11.2',
    ip: '10.0.4.12',
    userId: 'system'
  },
  {
    id: 'log_02',
    timestamp: '2026-09-21T17:46:02Z',
    level: 'INFO',
    service: 'sentinel2-pipeline',
    message: 'Ingested Sentinel-2B tile T44QND; Cloud cover index: 2.1%; Sun elevation: 62.4 deg',
    ip: '10.0.6.8',
    userId: 'system'
  },
  {
    id: 'log_03',
    timestamp: '2026-09-21T17:47:18Z',
    level: 'INFO',
    service: 'yolov8-inference-worker',
    message: 'Model YOLOv8l-Drishti-SatBuild-v2.4 finished inference for loc_guntur_421 in 412ms',
    metadata: { structuresDetected: 3, confidenceMean: 0.942 }
  },
  {
    id: 'log_04',
    timestamp: '2026-09-21T17:47:22Z',
    level: 'WARN',
    service: 'verification-engine',
    message: 'MISMATCH DETECTED: Survey 421/2B has official use "agricultural" vs AI detected "commercial_area"',
    metadata: { violationType: 'unauthorized_construction', evidenceScore: 0.945 }
  },
  {
    id: 'log_05',
    timestamp: '2026-09-21T17:48:00Z',
    level: 'AUDIT',
    service: 'auth-jwt-service',
    message: 'User Dr. A. V. Rao, IAS authenticated with scope: admin.write, reports.seal',
    ip: '192.168.1.104',
    userId: 'usr_admin_01'
  }
];

export const mockUsers = MOCK_USERS;
export const mockLocations = MOCK_LOCATIONS;
export const mockSatelliteImages = MOCK_SATELLITE_IMAGES;
export const mockPredictions = MOCK_AI_PREDICTIONS;
export const mockGovernmentRecords = MOCK_GOVT_RECORDS;
export const mockVerifications = MOCK_VERIFICATIONS;
export const mockReports = MOCK_REPORTS;
export const mockGroundTruthInspections = MOCK_FIELD_INSPECTIONS;
export const mockLogs = INITIAL_LOGS;
