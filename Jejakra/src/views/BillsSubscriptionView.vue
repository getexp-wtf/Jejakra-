<template>
  <div class="bills-subscription">
    <div class="page-header">
      <h2>Bills & Subscription</h2>
      <p class="page-subtitle">Manage your billing and subscription plans</p>
    </div>

    <div class="bills-content">
      <div class="placeholder-card">
        <div class="placeholder-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="14" y1="2" x2="14" y2="22"></line>
            <path d="M4 7h16M4 12h16M4 17h16"></path>
          </svg>
        </div>
        <h3>Bills & Subscription</h3>
        <p>This page will display your billing information and subscription management options.</p>
        <p class="placeholder-note">Coming soon...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.bills-subscription {
  max-width: 1200px;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h2 {
  font-family: 'Roboto', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: var(--color-text);
  opacity: 0.7;
}

.bills-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.placeholder-card {
  background: var(--color-background-soft);
  border: 2px dashed var(--color-border);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  max-width: 500px;
}

.placeholder-icon {
  color: var(--color-text);
  opacity: 0.5;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.placeholder-card h3 {
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 600;
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
</style>

