import React, { useState } from 'react';
import { 
  BookOpen, 
  Code2, 
  Database, 
  Server, 
  Copy, 
  Check, 
  GitBranch, 
  Boxes, 
  ShieldCheck, 
  Cpu, 
  ExternalLink 
} from 'lucide-react';

export const DocViewer: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'architecture' | 'api' | 'db' | 'deploy' | 'cicd'>('architecture');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-emerald-400 font-mono uppercase tracking-wider">
              Developer & Operations Portal
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              Production Documentation v2.4
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            System Architecture, PostGIS Schema & Deployment Guide
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete production documentation, OpenAPI specifications, Docker Compose, Kubernetes manifests, and automated CI/CD pipelines.
          </p>
        </div>

        {/* Doc Switcher */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveDoc('architecture')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition ${
              activeDoc === 'architecture' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Architecture
          </button>
          <button
            onClick={() => setActiveDoc('api')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition ${
              activeDoc === 'api' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            API Spec
          </button>
          <button
            onClick={() => setActiveDoc('db')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition ${
              activeDoc === 'db' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            PostGIS Schema
          </button>
          <button
            onClick={() => setActiveDoc('deploy')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition ${
              activeDoc === 'deploy' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Docker & K8s
          </button>
          <button
            onClick={() => setActiveDoc('cicd')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition ${
              activeDoc === 'cicd' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CI/CD Pipeline
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        {activeDoc === 'architecture' && (
          <div className="space-y-5 text-xs text-slate-300 leading-relaxed">
            <h3 className="text-base font-bold text-white flex items-center">
              <Cpu className="w-5 h-5 mr-2 text-emerald-400" />
              Drishti Geospatial Intelligence System Architecture
            </h3>
            <p>
              Drishti is designed as a distributed, high-throughput geospatial intelligence platform for Indian state revenue departments and municipal corporations (e.g. AP CRDA, HMDA, BBMP). It combines 10m Sentinel-2 multi-spectral optical data with YOLOv8 fine-tuned models to automatically detect unpermitted construction, FSI deviations, and waterbody encroachments.
            </p>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
{`+-----------------------------------------------------------------------------------+
|                           DRISHTI 7-STAGE PIPELINE                                |
+-----------------------------------------------------------------------------------+
| 1. Location Input & WGS84 Geofencing (Cadastral Survey Boundary)                 |
| 2. Sentinel-2 L2A Telemetry Ingestion (Multi-Spectral Bands: RGB, NIR, SWIR)      |
| 3. YOLOv8 Deep Vision Inference (Structure Bounding Boxes & NDVI drop)           |
| 4. Revenue Cadastre Integration (ROR / Pahani & Master Plan FSI Sanction)        |
| 5. Multi-Factor Verification Engine (Compatibility Matrix & 5-Factor Ensemble)    |
| 6. Interactive GIS Map Inspection & Drone Ground-Truth Sync                      |
| 7. Tamper-Evident Evidence Report Generation (SHA-256 Signed PDF & QR Token)      |
+-----------------------------------------------------------------------------------+`}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
                <div className="font-bold text-white mb-1">Optical Satellite Ingestion</div>
                <p className="text-slate-400 text-[11px]">
                  Pulls 10-meter ground resolution orthomosaics from Sentinel-2B with automated cloud mask filtering (&lt;10%) and sun elevation angle compensation.
                </p>
              </div>
              <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
                <div className="font-bold text-white mb-1">YOLOv8 & NDVI Engine</div>
                <p className="text-slate-400 text-[11px]">
                  Identifies structural roof outlines and evaluates NDVI vegetation shifts to detect newly built warehouses or unauthorized residential dwellings.
                </p>
              </div>
              <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
                <div className="font-bold text-white mb-1">Statutory Verification</div>
                <p className="text-slate-400 text-[11px]">
                  Cross-checks observed footprint with official Record of Rights to generate court-admissible violation dossiers under Section 115 of Municipalities Act.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeDoc === 'api' && (
          <div className="space-y-4 text-xs text-slate-300">
            <h3 className="text-base font-bold text-white flex items-center">
              <Code2 className="w-5 h-5 mr-2 text-cyan-400" />
              REST API & OpenAPI 3.0 Endpoints
            </h3>
            <p>
              The Drishti server exposes RESTful endpoints supporting JSON serialization, Prometheus metrics scraping, and JWT authorization headers.
            </p>

            <div className="space-y-3 font-mono text-[11px]">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-emerald-400 font-bold mr-2">GET</span>
                  <span className="text-slate-200">/api/v1/locations</span>
                  <span className="text-slate-500 ml-2">Lists all cadastral survey plots with status filters</span>
                </div>
                <span className="text-slate-500">200 OK</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-cyan-400 font-bold mr-2">POST</span>
                  <span className="text-slate-200">/api/v1/locations</span>
                  <span className="text-slate-500 ml-2">Registers new coordinates and initiates satellite ingestion</span>
                </div>
                <span className="text-slate-500">201 Created</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-purple-400 font-bold mr-2">POST</span>
                  <span className="text-slate-200">/api/v1/satellite-images/:id/analyze</span>
                  <span className="text-slate-500 ml-2">Triggers YOLOv8 structure identification inference</span>
                </div>
                <span className="text-slate-500">200 OK</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-rose-400 font-bold mr-2">POST</span>
                  <span className="text-slate-200">/api/v1/locations/:id/verify</span>
                  <span className="text-slate-500 ml-2">Executes multi-factor comparison and violation scoring</span>
                </div>
                <span className="text-slate-500">200 OK</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-emerald-400 font-bold mr-2">GET</span>
                  <span className="text-slate-200">/api/v1/metrics</span>
                  <span className="text-slate-500 ml-2">Prometheus telemetry scrape endpoint</span>
                </div>
                <span className="text-slate-500">text/plain</span>
              </div>
            </div>
          </div>
        )}

        {activeDoc === 'db' && (
          <div className="space-y-4 text-xs text-slate-300">
            <h3 className="text-base font-bold text-white flex items-center">
              <Database className="w-5 h-5 mr-2 text-amber-400" />
              PostgreSQL 15 + PostGIS 3.3 Relational Spatial Schema
            </h3>
            <p>
              Spatial indexes are generated using GIST on WGS 84 geography columns, allowing fast polygon containment queries and buffer zone intersections.
            </p>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto">
{`-- PostGIS Table for Cadastral Survey Parcels
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    survey_number VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    geometry GEOGRAPHY(POLYGON, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_locations_spatial ON locations USING GIST(geometry);`}
            </div>
          </div>
        )}

        {activeDoc === 'deploy' && (
          <div className="space-y-4 text-xs text-slate-300">
            <h3 className="text-base font-bold text-white flex items-center">
              <Boxes className="w-5 h-5 mr-2 text-indigo-400" />
              Dockerization & Kubernetes (GKE) Deployment
            </h3>
            <p>
              The application provides a multi-stage Docker build producing a secure, non-privileged Node 22 container, plus Kubernetes deployment manifests and a Docker Compose stack with PostGIS and Redis.
            </p>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
{`# Launch stack locally with Docker Compose
docker-compose up --build -d

# Deploy to Google Kubernetes Engine (GKE)
kubectl apply -f k8s/deployment.yaml -n drishti`}
            </div>
          </div>
        )}

        {activeDoc === 'cicd' && (
          <div className="space-y-4 text-xs text-slate-300">
            <h3 className="text-base font-bold text-white flex items-center">
              <GitBranch className="w-5 h-5 mr-2 text-emerald-400" />
              Automated GitHub Actions CI/CD Pipeline
            </h3>
            <p>
              Automated continuous integration pipeline running on every commit: lints TypeScript code, executes native unit tests, builds minimal container images, and deploys to Google Cloud Run / GKE with zero downtime.
            </p>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
{`# .github/workflows/deploy.yml
jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint
      - run: npm test
  build-and-containerize:
    needs: lint-and-test
    steps:
      - run: docker build -t drishti-app:latest .`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
