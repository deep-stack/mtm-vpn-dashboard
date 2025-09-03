# MTM VPN Dashboard

A Next.js dashboard application for monitoring the MTM VPN app.

## Build & Deploy

See [deployment instructions](./deploy/README.md) for detailed deployment steps using the Laconic registry system.

## Prerequisites

- Node.js 20+ 
- npm
- Access to MTM-to-NYM service API

## Setup

1. **Clone and install dependencies**:
   ```bash
   git clone https://git.vdb.to/cerc-io/mtm-vpn-dashboard.git
   cd mtm-vpn-dashboard
   npm install
   ```

1. **Start mtm-to-nym-service**

   Follow steps in <https://git.vdb.to/cerc-io/mtm-to-nym-service>

1. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```

   Update the following variables in `.env.local`:
   ```env
   # Public endpoint of mtm-to-nym-service
   NEXT_PUBLIC_MTM_SERVICE_URL=http://localhost:3000

   # NYM chain RPC endpoint  
   NEXT_PUBLIC_NYX_RPC_URL=https://rpc.nymtech.net

   # ETH chain RPC endpoint (for balance checking)
   ETH_RPC_URL=https://eth.rpc.laconic.com/your-api-key
   ```

1. **Start the development server**:
   ```bash
   npm run dev -- -p 4000
   ```

1. **Access the application**:
   Open <http://localhost:4000> in your browser


## Usage

- Navigate to `/dashboard` for the main overview
- View transactions at `/dashboard/transactions`  
- Monitor failed transactions at `/dashboard/failed`
- Check app downloads at `/dashboard/downloads`

## API Integration

The dashboard connects to:
- **MTM Service API**: Transaction and conversion data
- **Gitea API**: App release and download statistics (via proxy to avoid CORS)
- **Blockchain RPCs**: ETH and NYM network data for balance checking

## Project Structure

```
├── components/          # Reusable UI components
├── pages/              # Next.js pages and API routes
│   ├── api/            # API proxy endpoints
│   └── dashboard/      # Dashboard pages
├── utils/              # Utility functions and API clients
├── public/             # Static assets and PWA files
├── styles/             # Global CSS and Tailwind config
└── deploy/             # Deployment configuration
```
