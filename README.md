# PipeBand.app — Coming-Soon Website

> **"Every contest. Every result. Every story."**  
> The home of pipe band results, competitive history and statistics. Discover the performances, rivalries and records that define the pipe band world.

---

## Overview

**PipeBand.app** is a dedicated platform for RSPBA pipe band contest results, championship history, rankings, and advanced statistics. This repository contains the complete animated coming-soon website, interactive platform preview, waitlist registration backend, and production Docker deployment setup.

### Key Features
- **Cinematic Sports-Data Aesthetic**: Deep midnight navy palette (`#0B1425`), electric blue accents (`#8ABFFF`), technical coordinate grid, and staves score sheet motifs.
- **Interactive Platform Preview**: Demonstration contest aggregate table with discipline breakdowns (Piping, Drumming, Ensemble), year/grade toggles, and historical trajectory chart.
- **Persistent SQLite Launch List**: Full-stack registration backend storing signups in an isolated, ACID-compliant SQLite database with WAL mode.
- **Abuse Mitigation & Privacy**: Salted SHA-256 IP hashing (no raw IPs stored), honeypot spam traps, rate limiting, and RFC 5322 email validation.
- **Full Docker & DevOps Support**: Multi-stage `Dockerfile`, rootless container execution, external persistent volume mount for the database, and automated health checks.
- **Accessibility & Motion Restraint**: Full WCAG AA contrast compliance, responsive mobile menu, keyboard navigation, and `prefers-reduced-motion` support.

---

## Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons.
- **Backend**: Node.js 22, Express, built-in `node:sqlite`.
- **Database**: SQLite with persistent disk storage (`./data/pipeband_signups.db`).
- **Containerization**: Multi-stage Alpine Docker container (`compose.yaml`).

---

## Local Development

### Prerequisites
- Node.js 22+
- npm or bun

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy the example environment configuration:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```
The dev server starts on `http://localhost:3000` with Express backend routing and Vite middleware.

### 4. Build & Production Preview
```bash
npm run build
npm start
```

---

## Docker & Production Deployment

The project is configured for deployment on any standard VPS or container platform.

### Single-Command Startup
```bash
docker compose up -d --build
```

### Verifying Container Health
```bash
docker compose ps
curl http://localhost:3000/api/health
```

Expected health response:
```json
{
  "status": "ok",
  "timestamp": "2026-10-09T22:25:47.679Z",
  "service": "PipeBand.app API",
  "database": "connected",
  "uptime": 12.4
}
```

### Checking Application Logs
```bash
docker compose logs -f app
```

---

## Persistent Database & Backups

The SQLite database stores waitlist registrations at `./data/pipeband_signups.db`. In Docker, the host directory `./data` is mounted to `/app/data` inside the container. This ensures that rebuilding, upgrading, or destroying containers **never erases registered emails**.

### Database Backup
Because SQLite is configured in WAL (Write-Ahead Logging) mode, you can safely create a hot backup without stopping the service:

```bash
# Direct file backup:
sqlite3 ./data/pipeband_signups.db ".backup './data/pipeband_backup_$(date +%Y%m%d).db'"
```

Or export raw CSV records:
```bash
sqlite3 -header -csv ./data/pipeband_signups.db "SELECT id, email, interest, created_at FROM signups;" > signups_export.csv
```

### Database Restoration
```bash
docker compose down
cp /path/to/backup.db ./data/pipeband_signups.db
docker compose up -d
```

---

## Brand Logo Asset Placement

If you have an official vector or high-resolution raster logo:
1. Place your vector file at:  
   `public/assets/logo.svg`
2. Or place your transparent PNG at:  
   `public/assets/logo.png`
3. The application will automatically detect and load your supplied file in the navbar and hero with preserved transparency and aspect ratio. An inline high-precision vector fallback is rendered if the asset is missing.

---

## Reverse Proxy Setup (HTTPS for pipeband.app)

### Option A: Nginx
```nginx
server {
    server_name pipeband.app www.pipeband.app;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Option B: Caddy
```caddyfile
pipeband.app, www.pipeband.app {
    reverse_proxy 127.0.0.1:3000
}
```

---

## Security & Privacy Compliance

- **No Public Database Exposure**: The `./data` directory is strictly isolated outside static file roots.
- **Non-Root Execution**: Docker container runs as unprivileged user `appuser` (UID 1001).
- **Rate Limiting**: Requests to `/api/signup` are limited to 10 requests per 15-minute window per hashed IP.
- **Honeypot Protection**: Hidden form traps intercept automated spambots.
- **Privacy Notice**: Integrated accessible modal detailing data usage and user deletion rights.
