# MTM VPN Dashboard - Codebase Reference

## Project Overview
- **Name**: @cerc-io/test-progressive-web-app
- **Version**: 0.1.24
- **Framework**: Next.js with React 18
- **Language**: TypeScript
- **PWA**: Enabled with next-pwa plugin

## Directory Structure
```
/
├── deploy/                 # Deployment configurations and scripts
├── pages/                  # Next.js pages (routing)
│   ├── _app.tsx           # App wrapper component
│   ├── index.tsx          # Home page
│   └── api/               # API routes
│       └── hello.ts       # Sample API endpoint
├── public/                # Static assets
│   ├── icons/             # PWA icons (various sizes)
│   ├── manifest.json      # PWA manifest
│   ├── sw.js             # Service worker
│   └── workbox-*.js      # Workbox files
├── styles/               # CSS files
│   ├── globals.css       # Global styles
│   └── Home.module.css   # Home page styles
└── scripts/              # Build/deployment scripts
```

## Dependencies
### Core Dependencies
- **next**: "latest" - Next.js framework
- **next-pwa**: "^5.6.0" - Progressive Web App support
- **react**: "^18.2.0" - React library
- **react-dom**: "^18.2.0" - React DOM

### Dev Dependencies
- **@types/node**: "17.0.4"
- **@types/react**: "17.0.38"
- **typescript**: "4.5.4"

## Configuration Files

### next.config.js
- Uses next-pwa plugin for PWA functionality
- Environment variables exposed:
  - `CERC_TEST_WEBAPP_CONFIG1`
  - `CERC_TEST_WEBAPP_CONFIG2`
  - `CERC_WEBAPP_DEBUG`

### tsconfig.json
- Target: ES5
- Strict mode enabled
- JSX preserve mode
- Incremental compilation enabled

## Current Pages & Components

### pages/_app.tsx
- Root application wrapper
- Contains PWA meta tags and configuration
- Sets up viewport, theme color, manifest, and icons
- Title: "Laconic Test PWA"

### pages/index.tsx
- Home page component
- Displays environment variables in cards
- Uses CSS modules for styling
- Contains Laconic branding and logo

### pages/api/hello.ts
- Sample API route
- Returns JSON: `{ name: 'John Doe' }`

## Styling System
- **Global styles**: `/styles/globals.css`
- **Module styles**: CSS Modules pattern
- **Current theme**: 
  - Primary blue: `#0070f3`
  - Border color: `#eaeaea`
  - Theme color: `#317EFB`

### Key CSS Classes (Home.module.css)
- `.container` - Main page container (flexbox, centered)
- `.main` - Content area
- `.footer` - Footer with logo
- `.title` - Large heading (4rem)
- `.grid` - Card container (flexbox grid)
- `.card` - Individual cards with hover effects

## PWA Configuration
- Service worker enabled
- Multiple icon sizes provided (16x16 to 512x512)
- Manifest.json configured
- Workbox integration for caching

## Environment Variables
The app currently reads and displays three environment variables:
1. `CERC_TEST_WEBAPP_CONFIG1`
2. `CERC_TEST_WEBAPP_CONFIG2` 
3. `CERC_WEBAPP_DEBUG`

## Scripts Available
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server

## Deployment
- Contains Laconic-specific deployment scripts in `/deploy`
- Docker support with Dockerfile
- Shell scripts for deployment automation

## Development Commands
- **Dev server**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: Not configured
- **Typecheck**: Not configured

## Dashboard Implementation Status
✅ **Completed Features:**
- Admin authentication UI (login/logout)
- Responsive dashboard layout with sidebar navigation
- Overview dashboard with metrics and charts
- Transaction monitoring (all types: MTM-to-NYM, Bridge, Swap)
- Failed transaction analysis and retry functionality
- Account balance monitoring with ETH refill interface
- App download analytics with charts and version tracking
- PWA configuration updated for admin dashboard

## Dashboard Pages
- `/login` - Admin authentication
- `/dashboard` - Overview with stats and charts
- `/dashboard/transactions` - All transaction monitoring
- `/dashboard/failed` - Failed transaction analysis
- `/dashboard/balances` - Account balance management
- `/dashboard/downloads` - App download analytics

## Technical Implementation
- **Framework**: Next.js with TypeScript
- **UI**: Tailwind CSS + Headless UI components
- **Charts**: Custom CSS-based charts (replaced Recharts for compatibility)
- **Authentication**: Local storage based (ready for backend integration)
- **Data**: Mock data based on mtm-to-nym-service entities
- **Responsive**: Mobile-first design with collapsible sidebar
- **Build Status**: ✅ Successfully builds and runs
- **Dev Server**: ✅ Runs at http://localhost:3000

## Getting Started
1. **Install dependencies**: `npm install`
2. **Run development server**: `npm run dev`
3. **Build for production**: `npm run build`
4. **Access dashboard**: Navigate to http://localhost:3000
5. **Login**: Use any valid email + password (6+ characters)

## Chart Implementation
- Replaced Recharts with custom CSS-based visualizations for better compatibility
- Bar charts using CSS flex and dynamic heights
- Line charts using SVG paths and CSS positioning
- Progress bars for platform distribution
- All charts are animated and responsive

## Design Requirements
**CRITICAL: These requirements must be followed in ALL future modifications:**

### Dashboard Stats Display
- **NEVER add percentage changes, change indicators, or trend arrows to dashboard stats**
- Dashboard stats should only show: `id`, `name`, `stat`, and `icon` properties
- Do NOT add `change`, `changeType`, percentage indicators, or trend arrows
- Keep stats display clean and simple without any change/trend visualization

### UI Components
- No support/customer service functionality
- Focus purely on transaction monitoring and analytics
- Android-only for app downloads (no iOS)
- No authentication flow (direct redirect to dashboard)

# MTM to NYM Service API Documentation

This document describes the API endpoints for the MTM to NYM conversion service that powers the dashboard.

## Base URLs

- Dashboard API: `/api/dashboard`
- Transactions API: `/api/transactions`

## Dashboard Endpoints

### GET /api/dashboard/stats

Returns overall dashboard statistics with monthly conversion data.

**Response:**
```json
{
  "totalConversions": 1247,
  "successfulConversions": 1189,
  "failedConversions": 58,
  "totalDownloads": 3229,
  "monthlyData": [
    {
      "month": "Mar",
      "totalConversions": 137,
      "successfulConversions": 130,
      "failedConversions": 7
    },
    {
      "month": "Apr",
      "totalConversions": 124,
      "successfulConversions": 118,
      "failedConversions": 6
    },
    {
      "month": "May",
      "totalConversions": 149,
      "successfulConversions": 142,
      "failedConversions": 7
    },
    {
      "month": "Jun",
      "totalConversions": 162,
      "successfulConversions": 155,
      "failedConversions": 7
    },
    {
      "month": "Jul",
      "totalConversions": 149,
      "successfulConversions": 142,
      "failedConversions": 7
    },
    {
      "month": "Aug",
      "totalConversions": 311,
      "successfulConversions": 296,
      "failedConversions": 15
    }
  ]
}
```

## Transaction Endpoints

### GET /api/transactions/conversions

Returns paginated MTM to NYM conversion data with filtering options.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `status` (optional): Filter by status (`success`, `failed`, `all`)

**Response:**
```json
{
  "transactions": [
    {
      "id": "uuid-string",
      "transactionHash": "2AUxZpuQ...",
      "fromAddress": "HmWkGTaL...",
      "nymTransactionHash": "4E169C93...",
      "error": null,
      "createdAt": "2025-08-24T10:30:00.000Z"
    }
  ],
  "totalCount": 1247,
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 125
  }
}
```

## Other Transaction Endpoints

### POST /api/transactions/get-nym

Processes MTM to NYM conversion request.

**Request Body:**
```json
{
  "transactionHash": "2AUxZpuQ...",
  "nyxAddress": "n1sdnrq62m07gcwzpfmdgvqfpqqjvtnnllcypur8",
  "signedTxHash": "429ameDUN..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionHash": "2AUxZpuQ...",
    "fromAddress": "HmWkGTaL...",
    "nymTransactionHash": "4E169C93..."
  }
}
```

### GET /api/transactions/get-nym-balance

Returns current NYM balance of the service wallet.

**Response:**
```json
{
  "success": true,
  "data": {
    "balanceInNym": 75000.00
  }
}
```

## Error Responses

All endpoints return standard error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Database Integration

The API endpoints integrate directly with the existing database models:
- `Transaction` - MTM to NYM conversions with fields:
  - `id` (UUID)
  - `transactionHash` (Solana transaction hash)
  - `fromAddress` (Solana wallet address)
  - `nymTransactionHash` (NYM transaction hash, optional)
  - `error` (Error message if failed, optional)
  - `createdAt` (Timestamp)

## API Configuration

### Required Environment Variables

```env
# CORS Configuration (Required)
CORS_ALLOWED_ORIGINS="http://localhost:3001,https://dashboard.example.com"

# Database and Service Configuration
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
PORT=3000
NYX_PRIVATE_KEY=your_private_key
NYX_RPC_ENDPOINT=https://rpc.nymtech.net
COSMOS_GAS_PRICE=0.025
```

## API Usage

Start the service:

```bash
yarn start
```

APIs will be available at:
- Dashboard: `http://localhost:3000/api/dashboard/`
- Transactions: `http://localhost:3000/api/transactions/`

## Frontend Integration

The MTM VPN Dashboard connects via:

```env
NEXT_PUBLIC_MTM_SERVICE_URL=http://localhost:3000
```