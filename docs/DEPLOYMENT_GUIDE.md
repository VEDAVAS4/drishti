# 🛰️ DRISHTI - Deployment & Operations Guide

## 1. Quick Start with Docker Compose (Local & Staging)

Prerequisites:
- Docker 24.0+
- Docker Compose v2.20+

```bash
# 1. Clone repository and prepare environment
git clone https://github.com/drishti-intelligence/drishti-platform.git
cd drishti-platform
cp .env.example .env

# 2. Launch complete stack (PostGIS + Redis + Drishti App)
docker-compose up --build -d

# 3. Verify health
curl -f http://localhost:3000/api/health
```

---

## 2. Kubernetes (Google Cloud GKE) Production Deployment

```bash
# Set GCP Project and cluster credentials
gcloud container clusters get-credentials drishti-cluster --region asia-south1

# Apply secrets and deployment manifests
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/deployment.yaml

# Monitor rollout status
kubectl rollout status deployment/drishti-backend -n drishti
```

---

## 3. Environment Variables Reference

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | Runtime environment mode | `production` |
| `PORT` | Listening HTTP port | `3000` |
| `DATABASE_URL` | PostgreSQL 15 + PostGIS connection string | `postgresql://user:pass@host:5432/drishti` |
| `JWT_SECRET` | Secret key for HS256 tokens | `cryptographically_strong_random_key` |
| `GEMINI_API_KEY` | Gemini API key for automated legal synthesis | Injected via Secret Manager |
| `GCS_BUCKET` | Google Cloud Storage bucket for raster tiles | `drishti-satellite-evidence` |

---

## 4. Production Monitoring & Telemetry

- **Prometheus Metrics**: Scrape `/api/v1/metrics` every 15 seconds.
- **Health Probes**:
  - Liveness probe: `GET /api/health` (interval: 30s)
  - Readiness probe: `GET /api/health` (interval: 10s)
