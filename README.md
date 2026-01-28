# Jejakra

Jejakra is a platform layer that sits between users and system tooling.

It provides user management, access control, configuration, and integration capabilities that allow downstream systems — such as observability dashboards, APIs, and notification services — to be connected and consumed in a consistent way.

Jejakra acts as the entry point where:

- Users authenticate and manage their accounts
- Integrations are configured
- Access to tools like Grafana or APIs is provisioned
- Events such as billing cycles or system states can trigger notifications (e.g. email)

Jejakra focuses on orchestration and connectivity, not data collection.

## Repository Structure

```
Jejakra-/
├── README.md              # This file - repository overview
└── Jejakra-web/          # Web application project
    ├── README.md         # Detailed project documentation
    ├── package.json
    ├── src/
    └── ...
```

## Projects

### [Jejakra Web](./Jejakra-web/)

The web application frontend for Jejakra, built with React and Vite.

**Features:**
- BMI Calculator with metric and US unit support
- Patient Management system
- Appointment Scheduling with filtering and sorting
- Dashboard with statistics and quick access
- Settings and profile management
- Authentication and user management

**Technology Stack:**
- React 19.2.0
- Vite 7.2.4
- Lucide React (icons)
- React Compiler

## Quick Start

To get started with the Jejakra web application:

1. Navigate to the project directory:
   ```bash
   cd Jejakra-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

For detailed setup instructions, troubleshooting, and more information, see the [Jejakra Web README](./Jejakra-web/README.md).

## Getting Started

For comprehensive documentation, installation instructions, and development guides, please refer to the project-specific README:

- **[Jejakra Web Documentation](./Jejakra-web/README.md)** - Complete guide for the web application

## Prerequisites

- **Node.js** version 18 or higher (recommended: LTS version)
- **npm** (comes with Node.js) or **yarn** package manager

## Contributing

Each project in this repository has its own structure and documentation. Please refer to the specific project's README for contribution guidelines and development setup.
