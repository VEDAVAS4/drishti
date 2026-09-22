# 🛰️ DRISHTI - System Architecture & Engineering Specifications
## Production Geospatial Intelligence & Cadastral Verification Platform

---

## 1. High-Level System Architecture

```
                       +-----------------------------------+
                       |    Client Tier (React 19 / Vite)   |
                       |  - Interactive Satellite Map      |
                       |  - Spectral Band Viewer (NDVI)    |
                       |  - YOLO Detection Overlay         |
                       |  - Ground Truth Mobile / Drone    |
                       |  - Statutory Report Generator     |
                       +-----------------+-----------------+
                                         |
                                         | HTTPS / REST / WebSockets
                                         v
                       +-----------------+-----------------+
                       |    API Gateway & Security Tier    |
                       |  - JWT Bearer Authentication      |
                       |  - Role-Based Access Control      |
                       |  - Rate Limiting & Audit Logger   |
                       +-----------------+-----------------+
                                         |
            +----------------------------+----------------------------+
            |                            |                            |
            v                            v                            v
+-----------+-----------+    +-----------+-----------+    +-----------+-----------+
|  Location & Cadastre  |    | Satellite Data Engine |    | Deep Learning Vision  |
|  - PostGIS Spatial DB |    | - Google Earth Engine |    | - YOLOv8l Detection   |
|  - Revenue Records    |    | - Sentinel-2 Multi-   |    | - EfficientNet-B5     |
|  - Land Parcel Polygons|   |   spectral (10m)      |    | - Temporal NDVI Shift |
+-----------+-----------+    +-----------+-----------+    +-----------+-----------+
            |                            |                            |
            +----------------------------+----------------------------+
                                         |
                                         v
                       +-----------------+-----------------+
                       |   Verification & Scoring Engine   |
                       |  - Spatial Overlap Analysis       |
                       |  - Land Use Compatibility Matrix  |
                       |  - Multi-factor Evidence Ensemble |
                       |  - Statutory Violation Classifier |
                       +-----------------+-----------------+
                                         |
                                         v
                       +-----------------+-----------------+
                       |  Evidence Vault & Copilot Engine  |
                       |  - Cryptographic SHA-256 Signer   |
                       |  - Official PDF / Print Reports   |
                       |  - Gemini 3.8 Flash Legal Copilot |
                       +-----------------------------------+
```

---

## 2. Seven-Stage Pipeline Specification

1. **Stage 1: Location & Cadastral Geofencing**
   - Ingestion of geographic coordinates (lat/long) or Revenue Survey Number.
   - PostGIS `ST_GeomFromText` and `ST_Buffer` spatial polygon construction.
   - Buffer zoning (e.g. 30m lake protection, road widening, green belt).

2. **Stage 2: Optical & Multi-Spectral Satellite Imagery Retrieval**
   - Automated ingestion of Sentinel-2 MSI (Multi-Spectral Instrument) L2A Surface Reflectance.
   - Scene filtering: Cloud cover < 10%, sun elevation > 45°.
   - Channel separation:
     - Band 2, 3, 4 (True Color RGB)
     - Band 8 (Near-Infrared - NIR)
     - Band 11, 12 (Short-Wave Infrared - SWIR)
     - Calculation of Normalized Difference Vegetation Index: `NDVI = (B08 - B04) / (B08 + B04)`

3. **Stage 3: Deep Vision AI Inference**
   - **YOLOv8l Satellite Model**: Fine-tuned on high-resolution overhead orthomosaics for structure bounding boxes, roof type characterization, and total built-up footprint square meter calculation.
   - **EfficientNet-B5**: Multi-class land categorization (commercial, residential, agricultural, waterbody, green belt).
   - **Temporal Anomaly Detector**: Comparative analysis against historical imagery (30-365 days prior) to detect sudden loss of vegetation canopy.

4. **Stage 4: Government Revenue Cadastre Integration**
   - Real-time querying of state land records databases (Andhra Pradesh Webland, Telangana Dharani, Karnataka Bhoomi, Maharashtra MahaBhulekh).
   - Extraction of official Record of Rights (Pahani/ROR), sanctioned floor count, FSI limits, and registered owner.

5. **Stage 5: Verification & Multi-Factor Compatibility Engine**
   - **Compatibility Matrix**: Evaluates legal permissibility between detected use and registered category.
   - **Spatial Overlap Calculation**: PostGIS `ST_Intersection` percentage.
   - **Ensemble Evidence Score**:
     $$\text{Evidence Score} = 0.30(C_{\text{model}}) + 0.25(S_{\text{spatial}}) + 0.20(R_{\text{recency}}) + 0.15(Q_{\text{satellite}}) + 0.10(T_{\text{temporal}})$$
   - Automatic classification into:
     - `UNAUTHORIZED_CONSTRUCTION`
     - `LAND_USE_VIOLATION`
     - `WATERBODY_ENCROACHMENT`
     - `COMPLIANT`

6. **Stage 6: Interactive Geospatial Inspection & Drone Ground-Truth Sync**
   - Side-by-side temporal visual swipe (Historical T0 vs Current T1).
   - Mobile and drone ground-truth verification module syncing geotagged photos and field officer notes.

7. **Stage 7: Evidence-Backed Statutory Report Generation**
   - Tamper-proof PDF report generation with cryptographic SHA-256 digital signature, official government watermark, cadastral survey coordinates, and QR verification token.
