<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Fullstack Observability Demo</h1>
        <p class="hero-subtitle">
          Generate, collect, and visualize <strong>metrics</strong>, <strong>logs</strong>, and
          <strong>traces</strong>
          in a complete fullstack application demo
        </p>
        <div class="hero-actions">
          <RouterLink to="/login" class="btn btn-primary">Get Started</RouterLink>
          <RouterLink to="/dashboard" class="btn btn-secondary">View Demo</RouterLink>
        </div>
      </div>
      <div class="hero-visual">
        <div class="visual-container">
          <div class="metric-card-demo">
            <div class="demo-label">Metrics</div>
            <div class="demo-bar" style="width: 75%"></div>
          </div>
          <div class="log-card-demo">
            <div class="demo-label">Logs</div>
            <div class="demo-line"></div>
            <div class="demo-line"></div>
            <div class="demo-line"></div>
          </div>
          <div class="trace-card-demo">
            <div class="demo-label">Traces</div>
            <div class="demo-trace"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">Complete Observability Stack</h2>
        <p class="section-subtitle">
          Monitor your applications with comprehensive metrics, logs, and distributed tracing
        </p>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon metrics">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <h3>Metrics</h3>
            <p>
              Collect and visualize real-time performance metrics including CPU usage, memory
              consumption, request rates, latency percentiles, and custom business metrics. Track
              trends over time with powerful dashboards.
            </p>
            <ul class="feature-list">
              <li>Real-time metric collection</li>
              <li>Custom dashboard creation</li>
              <li>Historical trend analysis</li>
              <li>Alerting and notifications</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon logs">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="4 7 4 4 20 4 20 7"></polyline>
                <line x1="9" y1="20" x2="15" y2="20"></line>
                <line x1="12" y1="4" x2="12" y2="20"></line>
              </svg>
            </div>
            <h3>Logs</h3>
            <p>
              Centralized log aggregation with powerful search and filtering capabilities. Index and
              analyze application logs, error traces, and system events. Full-text search across all
              log entries with structured and unstructured data support.
            </p>
            <ul class="feature-list">
              <li>Centralized log aggregation</li>
              <li>Advanced search and filtering</li>
              <li>Log retention policies</li>
              <li>Error pattern detection</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon traces">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                ></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <h3>Distributed Traces</h3>
            <p>
              Track requests across microservices and distributed systems with end-to-end tracing.
              Understand service dependencies, identify bottlenecks, and debug performance issues
              with visual trace maps and detailed span information.
            </p>
            <ul class="feature-list">
              <li>End-to-end request tracing</li>
              <li>Service dependency mapping</li>
              <li>Performance bottleneck identification</li>
              <li>Span-level detail inspection</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works">
      <div class="container">
        <h2 class="section-title">How It Works</h2>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Generate Data</h3>
              <p>
                Our demo application automatically generates realistic metrics, logs, and traces
                simulating a production environment. Watch as data streams in real-time.
              </p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Collect & Store</h3>
              <p>
                Data is collected from various sources, normalized, and stored in optimized
                databases. Efficient indexing ensures fast query performance.
              </p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Visualize & Analyze</h3>
              <p>
                Interactive dashboards provide powerful visualization tools. Create custom views,
                set up alerts, and gain insights into your application's behavior.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Architecture Section -->
    <section class="architecture">
      <div class="container">
        <h2 class="section-title">Fullstack Architecture</h2>
        <p class="section-subtitle">
          Built with modern technologies for scalability and reliability
        </p>
        <div class="architecture-grid">
          <div class="arch-item">
            <div class="arch-icon">📊</div>
            <h4>Frontend</h4>
            <p>Vue.js dashboard with real-time updates</p>
          </div>
          <div class="arch-item">
            <div class="arch-icon">⚙️</div>
            <h4>Backend API</h4>
            <p>RESTful and GraphQL endpoints</p>
          </div>
          <div class="arch-item">
            <div class="arch-icon">💾</div>
            <h4>Data Storage</h4>
            <p>Time-series and document databases</p>
          </div>
          <div class="arch-item">
            <div class="arch-icon">🔄</div>
            <h4>Real-time Processing</h4>
            <p>Stream processing and aggregation</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <h2>Ready to Explore?</h2>
        <p>Start generating metrics, logs, and traces in seconds</p>
        <div class="cta-actions">
          <RouterLink to="/login" class="btn btn-primary btn-large">Get Started</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.landing-page {
  width: 100vw;
  max-width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  padding: 0;
  overflow-x: hidden;
  position: relative;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  min-height: 600px;
}

.hero-content {
  max-width: 600px;
  flex: 1;
}

.hero-title {
  font-family: 'Roboto', sans-serif;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  opacity: 0.95;
}

.hero-subtitle strong {
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-visual {
  flex: 1;
  max-width: 500px;
}

.visual-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
}

.metric-card-demo,
.log-card-demo,
.trace-card-demo {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 0.5rem;
  padding: 1rem;
}

.demo-label {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  opacity: 0.9;
}

.demo-bar {
  height: 8px;
  background: white;
  border-radius: 4px;
}

.demo-line {
  height: 2px;
  background: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
  border-radius: 1px;
}

.demo-line:nth-child(2) {
  width: 80%;
}

.demo-line:nth-child(3) {
  width: 60%;
}

.demo-line:nth-child(4) {
  width: 90%;
}

.demo-trace {
  width: 100%;
  height: 60px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  border-radius: 0.25rem;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.875rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  cursor: pointer;
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: transparent;
  color: white;
  border-color: white;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-large {
  padding: 1.125rem 2.5rem;
  font-size: 1.125rem;
}

.btn-outline {
  background: transparent;
  color: white;
  border-color: white;
}

.btn-outline:hover {
  background: white;
  color: #667eea;
}

/* Features Section */
.features {
  padding: 6rem 0;
  background: #0b0b0b;
}

.section-title {
  font-family: 'Roboto', sans-serif;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1rem;
  color: #ffffff;
}

.section-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  color: #ffffff;
  margin-bottom: 4rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: #151515;
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 80px;
  height: 80px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: white;
}

.feature-icon.metrics {
  background: linear-gradient(310deg, #17ad37 0%, #17ad37 100%);
}

.feature-icon.logs {
  background: linear-gradient(310deg, #fb6340 0%, #fb6340 100%);
}

.feature-icon.traces {
  background: linear-gradient(310deg, #11cdef 0%, #11cdef 100%);
}

.feature-card h3 {
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #ffffff;
}

.feature-card > p {
  color: #ffffff;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  padding: 0.5rem 0;
  color: #ffffff;
  padding-left: 1.5rem;
  position: relative;
}

.feature-list li:before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #17ad37;
  font-weight: bold;
}

/* How It Works Section */
.how-it-works {
  padding: 6rem 0;
  background: #0b0b0b;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  max-width: 800px;
  margin: 0 auto;
}

.step {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.step-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(310deg, #17ad37 0%, #17ad37 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 4px 6px rgba(23, 173, 55, 0.25);
}

.step-content h3 {
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #ffffff;
}

.step-content p {
  color: #ffffff;
  line-height: 1.6;
  font-size: 1.125rem;
}

/* Architecture Section */
.architecture {
  padding: 6rem 0;
  background: #0b0b0b;
}

.architecture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.arch-item {
  background: #151515;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
}

.arch-item:hover {
  transform: translateY(-4px);
}

.arch-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.arch-item h4 {
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #ffffff;
}

.arch-item p {
  color: #ffffff;
  font-size: 0.9375rem;
}

/* CTA Section */
.cta {
  padding: 6rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.cta h2 {
  font-family: 'Roboto', sans-serif;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 1rem;
}

.cta p {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  opacity: 0.95;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero {
    flex-direction: column;
    text-align: center;
    padding: 4rem 2rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-visual {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.125rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .step {
    flex-direction: column;
    text-align: center;
  }

  .architecture-grid {
    grid-template-columns: 1fr;
  }

  .cta h2 {
    font-size: 2rem;
  }
}
</style>
