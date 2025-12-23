<template>
  <div class="dashboard-overview">
    <!-- Summary Cards -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-title">TODAY'S MONEY</div>
          <div class="metric-icon wallet">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
        </div>
        <div class="metric-value">$53,000</div>
        <div class="metric-change positive">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          <span>+55% since yesterday</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-title">TODAY'S USERS</div>
          <div class="metric-icon users">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
        </div>
        <div class="metric-value">2,300</div>
        <div class="metric-change positive">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          <span>+3% since last week</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-title">NEW CLIENTS</div>
          <div class="metric-icon clients">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          </div>
        </div>
        <div class="metric-value">+3,462</div>
        <div class="metric-change negative">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
            <polyline points="17 18 23 18 23 12"></polyline>
          </svg>
          <span>-2% since last quarter</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-title">SALES</div>
          <div class="metric-icon sales">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="2" x2="12" y2="22"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
        </div>
        <div class="metric-value">$103,430</div>
        <div class="metric-change negative">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
            <polyline points="17 18 23 18 23 12"></polyline>
          </svg>
          <span>-5% than last month</span>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Left Column -->
      <div class="left-column">
        <!-- Sales Overview Chart -->
        <div class="chart-card">
          <div class="card-header">
            <h3>Sales overview</h3>
          </div>
          <div class="chart-container">
            <div class="chart-placeholder">
              <svg width="100%" height="300" viewBox="0 0 800 300" class="chart-svg">
                <!-- Chart background -->
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#17ad37;stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:#17ad37;stop-opacity:0" />
                  </linearGradient>
                </defs>
                
                <!-- Grid lines -->
                <line x1="50" y1="50" x2="50" y2="250" stroke="#e9ecef" stroke-width="1"/>
                <line x1="50" y1="250" x2="750" y2="250" stroke="#e9ecef" stroke-width="1"/>
                
                <!-- Chart line -->
                <path d="M 100 200 Q 200 180 300 150 T 500 100 T 700 80" 
                      fill="none" 
                      stroke="#17ad37" 
                      stroke-width="3" 
                      stroke-linecap="round"/>
                
                <!-- Fill area under line -->
                <path d="M 100 200 Q 200 180 300 150 T 500 100 T 700 80 L 700 250 L 100 250 Z" 
                      fill="url(#chartGradient)"/>
                
                <!-- Data points -->
                <circle cx="100" cy="200" r="4" fill="#17ad37"/>
                <circle cx="300" cy="150" r="4" fill="#17ad37"/>
                <circle cx="500" cy="100" r="4" fill="#17ad37"/>
                <circle cx="700" cy="80" r="4" fill="#17ad37"/>
                
                <!-- X-axis labels -->
                <text x="150" y="270" fill="#67748e" font-size="12" text-anchor="middle">Apr</text>
                <text x="300" y="270" fill="#67748e" font-size="12" text-anchor="middle">Jun</text>
                <text x="450" y="270" fill="#67748e" font-size="12" text-anchor="middle">Aug</text>
                <text x="600" y="270" fill="#67748e" font-size="12" text-anchor="middle">Oct</text>
                <text x="750" y="270" fill="#67748e" font-size="12" text-anchor="middle">Dec</text>
              </svg>
            </div>
          </div>
        </div>

        <!-- Sales by Country Table -->
        <div class="table-card">
          <div class="card-header">
            <h3>Sales by Country</h3>
          </div>
          <table class="sales-table">
            <thead>
              <tr>
                <th>Country</th>
                <th>Sales</th>
                <th>Value</th>
                <th>Bounce</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="country-info">
                    <span class="country-flag">🇺🇸</span>
                    <span>United States</span>
                  </div>
                </td>
                <td>2500</td>
                <td>$230,900</td>
                <td>29.9%</td>
              </tr>
              <tr>
                <td>
                  <div class="country-info">
                    <span class="country-flag">🇩🇪</span>
                    <span>Germany</span>
                  </div>
                </td>
                <td>3900</td>
                <td>$440,000</td>
                <td>40.22%</td>
              </tr>
              <tr>
                <td>
                  <div class="country-info">
                    <span class="country-flag">🇬🇧</span>
                    <span>Great Britain</span>
                  </div>
                </td>
                <td>1400</td>
                <td>$190,700</td>
                <td>23.44%</td>
              </tr>
              <tr>
                <td>
                  <div class="country-info">
                    <span class="country-flag">🇧🇷</span>
                    <span>Brasil</span>
                  </div>
                </td>
                <td>562</td>
                <td>$143,960</td>
                <td>32.14%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Column -->
      <div class="right-column">
        <!-- 3D Shapes Card -->
        <div class="feature-card">
          <div class="shapes-container">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
          </div>
          <div class="feature-content">
            <h4>Faster way to create web pages</h4>
            <p class="quote">"That's my skill. I'm not really specifically talented at anything except for the ability to learn."</p>
            <p class="author">- Michael Endacott</p>
          </div>
        </div>

        <!-- Categories Card -->
        <div class="categories-card">
          <div class="card-header">
            <h3>Categories</h3>
          </div>
          <div class="categories-list">
            <div class="category-item">
              <div class="category-icon devices">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                  <line x1="12" y1="18" x2="12.01" y2="18"></line>
                </svg>
              </div>
              <div class="category-content">
                <div class="category-title">Devices</div>
                <div class="category-description">250 in stock, 346+ sold</div>
              </div>
            </div>

            <div class="category-item">
              <div class="category-icon tickets">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="9" y1="12" x2="15" y2="12"></line>
                  <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"></path>
                  <path d="M3 12c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1z"></path>
                  <rect x="3" y="7" width="18" height="10" rx="2"></rect>
                </svg>
              </div>
              <div class="category-content">
                <div class="category-title">Tickets</div>
                <div class="category-description">123 closed, 15 open</div>
              </div>
            </div>

            <div class="category-item">
              <div class="category-icon logs">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="4 7 4 4 20 4 20 7"></polyline>
                  <line x1="9" y1="20" x2="15" y2="20"></line>
                  <line x1="12" y1="4" x2="12" y2="20"></line>
                </svg>
              </div>
              <div class="category-content">
                <div class="category-title">Error logs</div>
                <div class="category-description">1 is active, 40 closed</div>
              </div>
            </div>

            <div class="category-item">
              <div class="category-icon users">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div class="category-content">
                <div class="category-title">Happy Users</div>
                <div class="category-description">430</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.dashboard-overview {
  max-width: 100%;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.metric-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #67748e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(310deg, #17ad37 0%, #17ad37 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(23, 173, 55, 0.25);
}

.metric-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #344767;
  margin-bottom: 0.5rem;
}

.metric-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.metric-change.positive {
  color: #17ad37;
}

.metric-change.negative {
  color: #ea0606;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 1.5rem;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Chart Card */
.chart-card,
.table-card,
.feature-card,
.categories-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.card-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.card-header h3 {
  font-family: 'Castoro', serif;
  font-size: 1.125rem;
  font-weight: 400;
  font-style: italic;
  color: #344767;
  margin: 0;
}

.chart-container {
  width: 100%;
}

.chart-placeholder {
  width: 100%;
  overflow: hidden;
}

.chart-svg {
  width: 100%;
  height: auto;
}

/* Table */
.sales-table {
  width: 100%;
  border-collapse: collapse;
}

.sales-table thead {
  border-bottom: 1px solid #e9ecef;
}

.sales-table th {
  text-align: left;
  padding: 0.75rem 0;
  font-size: 0.75rem;
  font-weight: 700;
  color: #67748e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sales-table td {
  padding: 1rem 0;
  border-bottom: 1px solid #f8f9fa;
  color: #344767;
  font-weight: 500;
}

.sales-table tbody tr:last-child td {
  border-bottom: none;
}

.country-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.country-flag {
  font-size: 1.25rem;
}

/* Feature Card */
.feature-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.shapes-container {
  height: 200px;
  position: relative;
  margin-bottom: 2rem;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.8;
}

.shape-1 {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.3);
  top: 20px;
  left: 20px;
}

.shape-2 {
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.2);
  top: 60px;
  right: 30px;
}

.shape-3 {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.25);
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
}

.feature-content h4 {
  font-family: 'Castoro', serif;
  font-size: 1.25rem;
  font-weight: 400;
  font-style: italic;
  margin-bottom: 1rem;
  color: white;
}

.quote {
  font-size: 1rem;
  line-height: 1.6;
  font-style: italic;
  margin-bottom: 1rem;
  opacity: 0.95;
}

.author {
  font-size: 0.875rem;
  opacity: 0.8;
}

/* Categories Card */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.category-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.category-icon.devices {
  background: linear-gradient(310deg, #17ad37 0%, #17ad37 100%);
  color: white;
}

.category-icon.tickets {
  background: linear-gradient(310deg, #fb6340 0%, #fb6340 100%);
  color: white;
}

.category-icon.logs {
  background: linear-gradient(310deg, #11cdef 0%, #11cdef 100%);
  color: white;
}

.category-icon.users {
  background: linear-gradient(310deg, #ffd600 0%, #ffd600 100%);
  color: white;
}

.category-content {
  flex: 1;
}

.category-title {
  font-family: 'Castoro', serif;
  font-size: 1rem;
  font-weight: 400;
  font-style: italic;
  color: #344767;
  margin-bottom: 0.25rem;
}

.category-description {
  font-size: 0.875rem;
  color: #67748e;
}

@media (max-width: 1400px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
