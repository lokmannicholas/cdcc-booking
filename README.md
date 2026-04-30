# Quality HealthCare appointment booking demo

This deliverable includes:

- `frontend/`: a responsive Next.js booking flow modeled after the provided desktop and mobile mockups
- `server/`: an Express.js API for booking submissions

## Features

- 5-step appointment flow:
  1. service type
  2. location
  3. date and time preference
  4. personal information
  5. confirmation
- Responsive desktop/mobile layout
- Locale routes for:
  - Traditional Chinese: `/tc`
  - Simplified Chinese: `/sc`
  - English: `/en`
- Localized UI copy and seeded clinic/service data
- Doctor referral reminder modal for blood-test related services
- Submission API with validation and local JSON persistence
- Draft persistence in browser `localStorage`

## Project structure

```text
quality-healthcare-booking/
├─ frontend/
│  ├─ app/
│  ├─ components/
│  ├─ lib/
│  └─ .env.local.example
├─ server/
│  ├─ src/
│  ├─ data/submissions.json
│  └─ .env.example
└─ README.md
```

## Run locally

Install dependencies at the project root or per package.

### Option A: install from the root workspace

```bash
cd quality-healthcare-booking
npm install
```

Then run the API and frontend in two terminals:

```bash
npm run dev:server
```

```bash
npm run dev:frontend
```

### Option B: install each package separately

```bash
cd quality-healthcare-booking/server
cp .env.example .env
npm install
npm run dev
```

```bash
cd quality-healthcare-booking/frontend
cp .env.local.example .env.local
npm install
npm run dev
```

## Environment variables

### Frontend (`frontend/.env.local`)

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

### Server (`server/.env`)

```bash
PORT=4000
```

## API endpoints

- `GET /api/health`
- `POST /api/submissions`
- `GET /api/submissions`

### Submission payload example

```json
{
  "locale": "tc",
  "serviceId": "blood",
  "clinicId": "admiralty-centre",
  "appointmentDate": "2026-03-20",
  "timePreference": "morning",
  "customerName": "CHAN Tai Man, Wong Siu Ping",
  "whatsappPhone": "9921 6638",
  "alternateClinicConsent": true,
  "nearestDateConsent": true
}
```

## Notes

- Clinic records are seeded from the visible examples in the provided mockups.
- The New Territories and Outlying Islands tabs are included to match the design, but no sample clinic cards are seeded for those regions yet.
- Icons are recreated with inline SVG to keep the project self-contained.
- Submissions are stored in `server/data/submissions.json` for demo purposes.
