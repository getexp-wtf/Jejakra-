# Jejakra

Jejakra is a platform layer that sits between users and system tooling.

It provides user management, access control, configuration, and integration capabilities that allow downstream systems — such as observability dashboards, APIs, and notification services — to be connected and consumed in a consistent way.

Jejakra acts as the entry point where:

- Users authenticate and manage their accounts
- Integrations are configured
- Access to tools like Grafana or APIs is provisioned
- Events such as billing cycles or system states can trigger notifications (e.g. email)

Jejakra focuses on orchestration and connectivity, not data collection.
