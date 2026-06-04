# Archify Frontend

Archify Frontend is the user-facing application for Archify. It is a Next.js project built with TypeScript, designed to provide a responsive and interactive interface for designing software architecture diagrams.

## Overview

The frontend offers:

- an interactive diagram editor based on `@antv/x6`
- responsive UI components built with Tailwind CSS
- client-side authentication and API integration
- support for light/dark mode via `next-themes`
- a modular component structure for scalability and maintenance

## Technology stack

- **Next.js 16**
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **AntV X6** (`@antv/x6`, `@antv/x6-react-shape`)
- **Theme handling**: `next-themes`
- **Icons**: `lucide-react`, `devicon`

## Project structure

```text
archify-frontend/
├── src/
│   ├── app/              # Next.js app router pages and layouts
│   ├── components/       # Reusable UI components
│   ├── core/             # API clients, context, types, utilities
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Shared route definitions and libraries
│   ├── public/           # Static assets
│   └── types/            # TypeScript declarations
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Setup

### Prerequisites

- Node.js (recommended LTS)
- npm

### Install dependencies

```bash
cd archify-frontend
npm install
```

## Configuration

The frontend requires a backend API URL to operate. Set one of the following environment variables:

- `API_URL`
- `NEXT_PUBLIC_API_URL`

The application uses an internal Next.js proxy under `/api` to forward requests to the backend and attach the authentication token stored as `auth_token` in cookies.

## Development

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Scripts

- `npm run dev` — start local development server
- `npm run build` — create production build
- `npm run start` — run production build
- `npm run lint` — run ESLint analysis

## Deployment

1. Build the application:

```bash
npm run build
```

2. Run the optimized production server:

```bash
npm run start
```

## Authentication and routing

Authentication is managed through an `auth_token` cookie. Protected areas are enforced by middleware, including:

- `/dashboard`
- `/admin`
- `/profile`
- `/settings`

Unauthenticated users are redirected to the home page with the login flow.

## Notes

This frontend is intended to work alongside the `archify-backend` API. The backend must provide:

- authentication endpoints
- project and architecture persistence
- image upload and storage support
- authorization for admin and user roles

## License

This project is licensed under the MIT License.