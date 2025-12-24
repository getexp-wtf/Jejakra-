<template>
  <div class="dashboard-layout">
    <!-- Left Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2 class="logo">Jejakra Dashboard</h2>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <RouterLink to="/dashboard" class="nav-link" active-class="active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>Dashboard</span>
          </RouterLink>
          <RouterLink to="/dashboard/bills" class="nav-link" active-class="active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="14" y1="2" x2="14" y2="22"></line>
              <path d="M4 7h16M4 12h16M4 17h16"></path>
            </svg>
            <span>Billing</span>
          </RouterLink>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">ACCOUNT PAGES</div>
          <RouterLink to="/settings" class="nav-link" active-class="active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Profile</span>
          </RouterLink>
          <RouterLink to="/login" class="nav-link" active-class="active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            <span>Login</span>
          </RouterLink>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="help-section">
          <div class="help-title">Need Help?</div>
          <a href="#" class="help-link">Documentation</a>
          <button class="upgrade-button">Upgrade to Pro</button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="main-content">
      <header class="top-header">
        <div class="header-left">
          <button class="menu-toggle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div class="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input type="text" placeholder="Search..." />
          </div>
        </div>
        <div class="header-right">
          <button class="icon-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span class="notification-badge">3</span>
          </button>
          <button class="icon-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </button>
          <div class="user-menu">
            <div class="user-avatar-small">JD</div>
          </div>
        </div>
      </header>

      <main class="dashboard-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  background: #0b0b0b;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: #0b0b0b;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.sidebar-header {
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  font-family: 'Roboto', sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0.75rem;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 2rem;
}

.nav-section-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #ffffff;
  text-decoration: none;
  border-radius: 0.5rem;
  margin-bottom: 0.25rem;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.875rem;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.nav-link.active {
  background: linear-gradient(310deg, #17ad37 0%, #17ad37 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(23, 173, 55, 0.25);
}

.sidebar-footer {
  padding: 1.5rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.help-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.help-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.help-link {
  color: #17ad37;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
}

.help-link:hover {
  text-decoration: underline;
}

.upgrade-button {
  background: linear-gradient(310deg, #17ad37 0%, #17ad37 100%);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(23, 173, 55, 0.25);
  transition: all 0.2s ease;
}

.upgrade-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(23, 173, 55, 0.3);
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #0b0b0b;
}

.top-header {
  background: #151515;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu-toggle {
  background: transparent;
  border: none;
  color: #ffffff;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-toggle:hover {
  background: rgba(255, 255, 255, 0.05);
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  width: 300px;
  transition: all 0.2s ease;
}

.search-box:focus-within {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
}

.search-box svg {
  color: rgba(255, 255, 255, 0.6);
  flex-shrink: 0;
}

.search-box input {
  flex: 1;
  background: none;
  border: none;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  outline: none;
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon-button {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #f5576c;
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.user-menu {
  margin-left: 0.5rem;
}

.user-avatar-small {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.user-avatar-small:hover {
  transform: scale(1.05);
}

.dashboard-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: #0b0b0b;
}

@media (max-width: 1024px) {
  .sidebar {
    width: 240px;
  }

  .dashboard-content {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .dashboard-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    max-height: 200px;
  }

  .top-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .search-box {
    width: 100%;
  }

  .header-left {
    width: 100%;
  }
}
</style>
