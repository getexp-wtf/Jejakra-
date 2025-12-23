<template>
  <div class="settings">
    <div class="page-header">
      <h2>Settings</h2>
      <p class="page-subtitle">Manage your account settings and preferences</p>
    </div>

    <div class="settings-container">
      <nav class="settings-nav">
        <button
          @click="activeTab = 'profile'"
          :class="['settings-tab', { active: activeTab === 'profile' }]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Profile</span>
        </button>
        <button
          @click="activeTab = 'password'"
          :class="['settings-tab', { active: activeTab === 'password' }]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>Password</span>
        </button>
        <button
          @click="activeTab = 'email'"
          :class="['settings-tab', { active: activeTab === 'email' }]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <span>Email</span>
        </button>
      </nav>

      <div class="settings-content">
        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="settings-section">
          <div class="section-header">
            <h3>Profile</h3>
            <p class="section-description">Update your profile information</p>
          </div>
          <div class="placeholder-card">
            <div class="placeholder-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h4>Profile Settings</h4>
            <p>This section will contain profile management options such as name, avatar, and personal information.</p>
            <p class="placeholder-note">Coming soon...</p>
          </div>
        </div>

        <!-- Password Tab -->
        <div v-if="activeTab === 'password'" class="settings-section">
          <div class="section-header">
            <h3>Password</h3>
            <p class="section-description">Change your account password</p>
          </div>
          <div class="placeholder-card">
            <div class="placeholder-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h4>Password Settings</h4>
            <p>This section will allow you to change your account password securely.</p>
            <p class="placeholder-note">Coming soon...</p>
          </div>
        </div>

        <!-- Email Tab -->
        <div v-if="activeTab === 'email'" class="settings-section">
          <div class="section-header">
            <h3>Email</h3>
            <p class="section-description">Manage your email address</p>
          </div>
          <div class="placeholder-card">
            <div class="placeholder-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <h4>Email Settings</h4>
            <p>This section will allow you to update your email address and manage email preferences.</p>
            <p class="placeholder-note">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('profile')
</script>

<style scoped>
.settings {
  max-width: 1200px;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h2 {
  font-family: 'Castoro', serif;
  font-size: 2rem;
  font-weight: 400;
  font-style: italic;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-family: 'Outfit', sans-serif;
  color: var(--color-text);
  opacity: 0.7;
  font-size: 1.125rem;
}

.settings-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

.settings-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.settings-tab {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.settings-tab:hover {
  background: var(--color-background);
  border-color: var(--color-border-hover);
}

.settings-tab.active {
  background: hsla(160, 100%, 37%, 1);
  color: white;
  border-color: hsla(160, 100%, 37%, 1);
}

.settings-content {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 2rem;
}

.settings-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.section-header h3 {
  font-family: 'Castoro', serif;
  font-size: 1.5rem;
  font-weight: 400;
  font-style: italic;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.section-description {
  color: var(--color-text);
  opacity: 0.7;
}

.placeholder-card {
  background: var(--color-background);
  border: 2px dashed var(--color-border);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
}

.placeholder-icon {
  color: var(--color-text);
  opacity: 0.5;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.placeholder-card h4 {
  font-family: 'Castoro', serif;
  font-size: 1.25rem;
  font-weight: 400;
  font-style: italic;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.placeholder-card p {
  color: var(--color-text);
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.placeholder-note {
  margin-top: 1rem;
  font-style: italic;
  opacity: 0.7;
  font-size: 0.9375rem;
}

@media (max-width: 968px) {
  .settings-container {
    grid-template-columns: 1fr;
  }

  .settings-nav {
    flex-direction: row;
    overflow-x: auto;
  }

  .settings-tab {
    white-space: nowrap;
  }
}
</style>

