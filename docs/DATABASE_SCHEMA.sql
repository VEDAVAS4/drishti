-- ====================================================================
-- DRISHTI GEOSPATIAL INTELLIGENCE PLATFORM - DATABASE SCHEMA
-- Target Engine: PostgreSQL 15+ with PostGIS 3.3+ Extension
-- ====================================================================

-- 1. Enable PostGIS & Spatial Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enumerated Domain Types
CREATE TYPE user_role_enum AS ENUM ('admin', 'analyst', 'field_officer', 'citizen');
CREATE TYPE processing_status_enum AS ENUM ('pending', 'processing', 'completed', 'flagged', 'error');
CREATE TYPE priority_enum AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE satellite_provider_enum AS ENUM ('sentinel2', 'landsat8', 'google_earth');
CREATE TYPE verification_status_enum AS ENUM ('verified', 'mismatch', 'needs_review', 'inconclusive');
CREATE TYPE violation_type_enum AS ENUM ('unauthorized_construction', 'land_use_violation', 'waterbody_encroachment', 'fsi_violation', 'none');

-- 3. Users Table (RBAC)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'analyst',
    role_title VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    badge_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Locations & Cadastral Parcels
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    location_name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    mandal VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    survey_number VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    priority priority_enum DEFAULT 'medium',
    status processing_status_enum DEFAULT 'pending',
    plot_area_sqm DOUBLE PRECISION DEFAULT 0.0,
    buffer_meters INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    geometry GEOGRAPHY(POLYGON, 4326) -- PostGIS boundary
);

CREATE INDEX idx_locations_geometry ON locations USING GIST(geometry);
CREATE INDEX idx_locations_survey ON locations(district, survey_number);

-- 5. Satellite Images Ingestion Table
CREATE TABLE satellite_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    provider satellite_provider_enum NOT NULL DEFAULT 'sentinel2',
    image_url TEXT NOT NULL,
    historical_image_url TEXT,
    nir_image_url TEXT,
    ndvi_image_url TEXT,
    capture_date DATE NOT NULL,
    cloud_cover_percent FLOAT DEFAULT 0.0,
    resolution_meters INTEGER DEFAULT 10,
    scene_id VARCHAR(255) NOT NULL,
    bands JSONB,
    sun_elevation FLOAT,
    gcs_storage_path VARCHAR(500),
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_satellite_location ON satellite_images(location_id);

-- 6. AI Vision Predictions (YOLOv8 + EfficientNet)
CREATE TABLE ai_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    satellite_image_id UUID NOT NULL REFERENCES satellite_images(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    model_version VARCHAR(100) NOT NULL,
    primary_class VARCHAR(100) NOT NULL,
    confidence FLOAT NOT NULL,
    building_count INTEGER DEFAULT 0,
    total_built_area_sqm FLOAT DEFAULT 0.0,
    detected_structures JSONB, -- Array of {label, confidence, x, y, width, height, areaSqm}
    land_use_probabilities JSONB,
    ndvi_mean_current FLOAT,
    ndvi_mean_historical FLOAT,
    ndvi_change_percent FLOAT,
    temporal_change_detected BOOLEAN DEFAULT FALSE,
    processing_time_ms INTEGER,
    inference_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_predictions_location ON ai_predictions(location_id);

-- 7. Government Land Cadastre Records
CREATE TABLE government_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    record_source VARCHAR(100) NOT NULL, -- revenue_dept, hmda, grhmc, etc.
    official_land_use VARCHAR(100) NOT NULL,
    registered_owner_name VARCHAR(255) NOT NULL,
    survey_number VARCHAR(100) NOT NULL,
    sub_division_number VARCHAR(50),
    patta_number VARCHAR(100),
    plot_area_sqm FLOAT NOT NULL,
    permitted_floors INTEGER DEFAULT 0,
    zoning_classification VARCHAR(255) NOT NULL,
    last_updated DATE,
    revenue_inspector_verified BOOLEAN DEFAULT TRUE,
    remarks TEXT
);

CREATE INDEX idx_govt_records_location ON government_records(location_id);

-- 8. Verification Results (Matching & Violation Analysis)
CREATE TABLE verification_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    satellite_image_id UUID REFERENCES satellite_images(id),
    govt_record_id UUID REFERENCES government_records(id),
    verification_status verification_status_enum NOT NULL,
    violation_type violation_type_enum NOT NULL,
    ai_detected_use VARCHAR(255) NOT NULL,
    official_recorded_use VARCHAR(255) NOT NULL,
    compatibility_score FLOAT NOT NULL,
    spatial_overlap_score FLOAT NOT NULL,
    temporal_anomaly_score FLOAT NOT NULL,
    evidence_score FLOAT NOT NULL,
    recommendation TEXT,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_by VARCHAR(255),
    notes TEXT
);

CREATE INDEX idx_verification_status ON verification_results(verification_status);
CREATE INDEX idx_verification_violation ON verification_results(violation_type);

-- 9. Evidence Reports
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_number VARCHAR(100) UNIQUE NOT NULL,
    verification_id UUID NOT NULL REFERENCES verification_results(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    generated_by VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    violation_type violation_type_enum NOT NULL,
    verification_status verification_status_enum NOT NULL,
    evidence_score FLOAT NOT NULL,
    hash_signature VARCHAR(128) NOT NULL,
    qr_code_token VARCHAR(255) NOT NULL,
    pdf_gcs_url VARCHAR(500)
);

-- 10. Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    level VARCHAR(20) NOT NULL,
    service VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB,
    user_id VARCHAR(100),
    ip_address INET
);

CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);
