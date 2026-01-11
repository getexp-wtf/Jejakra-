# Jejakra

Jejakra is a platform layer that sits between users and system tooling.

It provides user management, access control, configuration, and integration capabilities that allow downstream systems — such as observability dashboards, APIs, and notification services — to be connected and consumed in a consistent way.

Jejakra acts as the entry point where:

- Users authenticate and manage their accounts
- Integrations are configured
- Access to tools like Grafana or APIs is provisioned
- Events such as billing cycles or system states can trigger notifications (e.g. email)

Jejakra focuses on orchestration and connectivity, not data collection.

## Running the Project Locally

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm (comes with Node.js) or yarn

### Installation

1. Navigate to the project directory:

   ```bash
   cd Jejakra-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port if 5173 is in use).

### Build

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

### Linting

To run the linter:

```bash
npm run lint
```
