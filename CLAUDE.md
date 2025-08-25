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
- Customer support ticket management system
- PWA configuration updated for admin dashboard

## Dashboard Pages
- `/login` - Admin authentication
- `/dashboard` - Overview with stats and charts
- `/dashboard/transactions` - All transaction monitoring
- `/dashboard/failed` - Failed transaction analysis
- `/dashboard/balances` - Account balance management
- `/dashboard/downloads` - App download analytics
- `/dashboard/support` - Customer support system

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