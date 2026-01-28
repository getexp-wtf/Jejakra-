# Jejakra

Jejakra is a platform layer that sits between users and system tooling.

It provides user management, access control, configuration, and integration capabilities that allow downstream systems — such as observability dashboards, APIs, and notification services — to be connected and consumed in a consistent way.

Jejakra acts as the entry point where:

- Users authenticate and manage their accounts
- Integrations are configured
- Access to tools like Grafana or APIs is provisioned
- Events such as billing cycles or system states can trigger notifications (e.g. email)

Jejakra focuses on orchestration and connectivity, not data collection.

## Technology Stack

This project is built with modern web technologies:

- **React** 19.2.0 - UI library
- **Vite** 7.2.4 - Build tool and development server
- **Lucide React** - Icon library
- **React Compiler** - Optimized React compilation via Babel plugin
- **ESLint** - Code linting and quality assurance

## Features

The Jejakra web application includes the following features:

- **BMI Calculator** - Calculate and track Body Mass Index with metric and US unit support
- **Patient Management** - Create, view, and manage patient records
- **Appointment Scheduling** - Schedule and manage appointments with filtering and sorting
- **Dashboard** - Overview dashboard with statistics and quick access to key features
- **Settings** - User profile and security settings management
- **Authentication** - User login and account management

## Running the Project Locally

### Prerequisites

- **Node.js** version 18 or higher (recommended: LTS version)
- **npm** (comes with Node.js) or **yarn** package manager

### Environment Variables

The application supports optional environment variables for configuration. Create a `.env` file in the root directory if needed:

```bash
# Optional: API base URL (defaults to '/api' if not set)
VITE_API_URL=/api
```

**Note:** Environment variables prefixed with `VITE_` are exposed to the client-side code. Make sure not to include sensitive credentials in these variables.

### Installation

1. Navigate to the project directory:

   ```bash
   cd Jejakra-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Project Structure

```
Jejakra-web/
├── src/
│   ├── components/       # Reusable React components
│   │   ├── appointments/ # Appointment-related components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── patients/     # Patient management components
│   │   └── shared/       # Shared/common components
│   ├── context/          # React context providers (e.g., AuthContext)
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API and service layer
│   ├── utils/            # Utility functions and helpers
│   ├── App.jsx           # Main application component
│   ├── App.css           # Application styles
│   └── main.jsx          # Application entry point
├── public/               # Static assets
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
└── package.json          # Project dependencies and scripts
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port if 5173 is in use).

**Note:** This project uses React Compiler via Babel plugin for optimized React compilation. The development server includes hot module replacement (HMR) for fast development feedback.

### Build

To create a production build:

```bash
npm run build
```

The optimized production build will be output to the `dist` directory. This directory contains all static assets ready for deployment to any static hosting service.

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

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port. You can also specify a different port:

```bash
npm run dev -- --port 3000
```

### Dependency Installation Issues

If you encounter issues installing dependencies:

1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete `node_modules` and `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. On Windows PowerShell:
   ```powershell
   Remove-Item -Recurse -Force node_modules, package-lock.json
   npm install
   ```

### Build Errors

If the build fails:

- Ensure all dependencies are installed: `npm install`
- Check Node.js version: `node --version` (should be 18+)
- Clear the build cache: Delete `dist` folder and rebuild

### Module Resolution Errors

If you see module resolution errors:

- Verify all imports use correct paths
- Check that file extensions match (`.jsx` vs `.js`)
- Ensure environment variables are properly prefixed with `VITE_`

## Browser Support

This application is built with modern web standards and supports the following browsers:

- **Chrome** (latest)
- **Firefox** (latest)
- **Safari** (latest)
- **Edge** (latest)

The application uses ES6+ features and requires browsers that support modern JavaScript. For production deployments, consider using a service like Babel or ensuring your target browsers support the features used in the codebase.
