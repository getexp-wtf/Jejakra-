<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isDashboardRoute = computed(
  () => route.path.startsWith('/dashboard') || route.path.startsWith('/settings'),
)
</script>

<template>
  <header v-if="!isDashboardRoute" class="app-header">
    <div class="header-content">
      <RouterLink to="/" class="logo-link">
        <h1 class="logo">jejakra</h1>
      </RouterLink>

      <nav class="header-nav">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
        <RouterLink to="/signin">Sign In</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.app-header {
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-link {
  text-decoration: none;
  color: inherit;
}

.logo {
  font-family: 'Poppins', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(310deg, #17ad37 0%, #17ad37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: #17ad37;
}

.header-nav {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.header-nav a {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  color: var(--color-text);
  text-decoration: none;
  border-radius: 0.5rem;
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
}

.header-nav a:hover {
  background: var(--color-background-soft);
  color: hsla(160, 100%, 37%, 1);
}

.header-nav a.router-link-exact-active {
  background: linear-gradient(310deg, #17ad37 0%, #17ad37 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(23, 173, 55, 0.25);
}

@media (max-width: 768px) {
  .app-header {
    padding: 1rem;
  }

  .logo {
    font-size: 26px;
    font-weight: 800;
    text-decoration: none;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
  }

  .header-nav {
    gap: 0.25rem;
  }

  .header-nav a {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
}
</style>
