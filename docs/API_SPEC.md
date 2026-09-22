# 🛰️ DRISHTI REST API & OpenAPI 3.0 Specifications

Base URL: `https://api.drishti.gov.in/api/v1` (Production) / `http://localhost:3000/api/v1` (Local)

---

## 1. Authentication (`/api/v1/auth`)

### `POST /auth/login`
Authenticates a municipal officer, geospatial analyst, or citizen auditor.

**Request Body:**
```json
{
  "email": "commissioner@drishti.gov.in",
  "role": "admin"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_admin_01",
    "name": "Dr. A. V. Rao, IAS",
    "role": "admin",
    "department": "Municipal Administration & Urban Development"
  }
}
```

---

## 2. Locations (`/api/v1/locations`)

### `GET /locations`
Lists cadastral locations with optional filtering.

**Query Parameters:**
- `status`: `pending` | `processing` | `completed` | `flagged`
- `priority`: `critical` | `high` | `medium` | `low`
- `search`: string (matches survey number, village, or district)

---

### `POST /locations`
Registers a new survey plot coordinate for satellite ingestion.

**Request Body:**
```json
{
  "locationName": "Guntur Rural Bypass Survey 421",
  "state": "Andhra Pradesh",
  "district": "Guntur",
  "surveyNumber": "421/2B",
  "latitude": 16.3475,
  "longitude": 80.5212,
  "priority": "critical",
  "plotAreaSqm": 5400
}
```

---

## 3. Satellite Imagery (`/api/v1/locations/{id}/satellite-images`)

### `GET /locations/{id}/satellite-images`
Retrieves Sentinel-2 multi-spectral scene data.

**Response (200 OK):**
```json
{
  "satelliteImage": {
    "id": "sat_guntur_01",
    "provider": "sentinel2",
    "captureDate": "2026-09-15",
    "cloudCoverPercent": 2.1,
    "resolutionMeters": 10,
    "sceneId": "S2B_MSIL2A_20260915T051649_N0500_R019_T44QND",
    "bands": ["B02", "B03", "B04", "B08", "B11"]
  }
}
```

---

## 4. Deep Vision Analysis (`/api/v1/satellite-images/{id}/analyze`)

### `POST /satellite-images/{id}/analyze`
Runs YOLOv8 structure identification and spectral change analysis.

**Response (200 OK):**
```json
{
  "success": true,
  "prediction": {
    "modelVersion": "YOLOv8l-Drishti-SatBuild-v2.4",
    "primaryClass": "commercial_area",
    "confidence": 0.942,
    "buildingCount": 3,
    "totalBuiltAreaSqm": 1420,
    "detectedStructures": [
      {
        "label": "commercial_structure",
        "confidence": 0.94,
        "x": 28,
        "y": 32,
        "width": 38,
        "height": 34,
        "areaSqm": 980
      }
    ],
    "ndviChangePercent": -82.35,
    "temporalChangeDetected": true
  }
}
```

---

## 5. Verification Engine (`/api/v1/locations/{id}/verify`)

### `POST /locations/{id}/verify`
Compares AI predictions against revenue records and computes evidence confidence.

**Response (200 OK):**
```json
{
  "status": "mismatch",
  "violationType": "unauthorized_construction",
  "evidenceScore": 0.945,
  "verification": {
    "compatibilityScore": 0.08,
    "spatialOverlapScore": 0.94,
    "recommendation": "STATUTORY MISMATCH: Issue Section 115 Stop-Work Notice."
  }
}
```

---

## 6. Report Generation (`/api/v1/verifications/{id}/generate-report`)

### `POST /verifications/{id}/generate-report`
Generates an official tamper-evident evidence report with digital signature.

---

## 7. Prometheus Metrics & Telemetry (`/api/v1/metrics`)

### `GET /metrics`
Returns system metrics in JSON or Prometheus text format (`Accept: text/plain`).
