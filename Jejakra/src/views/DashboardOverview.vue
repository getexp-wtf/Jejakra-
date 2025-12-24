<template>
  <div class="dashboard-overview">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Welcome back! Here's what's happening with your metrics today.</p>
        </div>
        <div class="header-actions">
          <button class="action-button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Last 30 days
          </button>
          <button class="action-button primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Report
          </button>
        </div>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-title">Total Revenue</div>
          <div class="metric-icon revenue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="2" x2="12" y2="22"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
        </div>
        <div class="metric-value">$53,000</div>
        <div class="metric-change positive">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          <span>+55% from last month</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-title">Active Users</div>
          <div class="metric-icon users">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
        </div>
        <div class="metric-value">2,300</div>
        <div class="metric-change positive">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          <span>+3% from last week</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-title">New Customers</div>
          <div class="metric-icon customers">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          </div>
        </div>
        <div class="metric-value">+3,462</div>
        <div class="metric-change negative">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
            <polyline points="17 18 23 18 23 12"></polyline>
          </svg>
          <span>-2% from last quarter</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-title">Conversion Rate</div>
          <div class="metric-icon conversion">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
        </div>
        <div class="metric-value">3.24%</div>
        <div class="metric-change positive">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          <span>+0.5% from last month</span>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Left Column -->
      <div class="left-column">
        <!-- Revenue Chart -->
        <div class="chart-card">
          <div class="card-header">
            <div>
              <h3>Revenue Overview</h3>
              <p class="card-subtitle">Monthly revenue performance</p>
            </div>
            <div class="card-actions">
              <button class="icon-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </button>
            </div>
          </div>
          <div class="chart-container">
            <div class="chart-placeholder">
              <svg width="100%" height="320" viewBox="0 0 800 320" class="chart-svg">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#17ad37;stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:#17ad37;stop-opacity:0" />
                  </linearGradient>
                </defs>
                
                <!-- Grid lines -->
                <line x1="60" y1="40" x2="60" y2="280" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                <line x1="60" y1="280" x2="760" y2="280" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                
                <!-- Chart line -->
                <path d="M 100 240 Q 200 200 300 160 T 500 100 T 700 60" 
                      fill="none" 
                      stroke="#17ad37" 
                      stroke-width="3" 
                      stroke-linecap="round"/>
                
                <!-- Fill area -->
                <path d="M 100 240 Q 200 200 300 160 T 500 100 T 700 60 L 700 280 L 100 280 Z" 
                      fill="url(#chartGradient)"/>
                
                <!-- Data points -->
                <circle cx="100" cy="240" r="5" fill="#17ad37"/>
                <circle cx="300" cy="160" r="5" fill="#17ad37"/>
                <circle cx="500" cy="100" r="5" fill="#17ad37"/>
                <circle cx="700" cy="60" r="5" fill="#17ad37"/>
                
                <!-- X-axis labels -->
                <text x="150" y="300" fill="rgba(255,255,255,0.6)" font-size="11" text-anchor="middle" font-family="Inter">Jan</text>
                <text x="300" y="300" fill="rgba(255,255,255,0.6)" font-size="11" text-anchor="middle" font-family="Inter">Mar</text>
                <text x="450" y="300" fill="rgba(255,255,255,0.6)" font-size="11" text-anchor="middle" font-family="Inter">May</text>
                <text x="600" y="300" fill="rgba(255,255,255,0.6)" font-size="11" text-anchor="middle" font-family="Inter">Jul</text>
                <text x="750" y="300" fill="rgba(255,255,255,0.6)" font-size="11" text-anchor="middle" font-family="Inter">Sep</text>
              </svg>
            </div>
          </div>
        </div>

        <!-- Recent Activity Table -->
        <div class="table-card">
          <div class="card-header">
            <div>
              <h3>Recent Activity</h3>
              <p class="card-subtitle">Latest transactions and events</p>
            </div>
            <button class="view-all-link">View All</button>
          </div>
          <div class="table-container">
            <table class="activity-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar">JD</div>
                      <div>
                        <div class="user-name">John Doe</div>
                        <div class="user-email">john@example.com</div>
                      </div>
                    </div>
                  </td>
                  <td>Subscription</td>
                  <td>2 hours ago</td>
                  <td><span class="status-badge success">Active</span></td>
                </tr>
                <tr>
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar">JS</div>
                      <div>
                        <div class="user-name">Jane Smith</div>
                        <div class="user-email">jane@example.com</div>
                      </div>
                    </div>
                  </td>
                  <td>Payment</td>
                  <td>5 hours ago</td>
                  <td><span class="status-badge success">Completed</span></td>
                </tr>
                <tr>
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar">MJ</div>
                      <div>
                        <div class="user-name">Mike Johnson</div>
                        <div class="user-email">mike@example.com</div>
                      </div>
                    </div>
                  </td>
                  <td>Upgrade</td>
                  <td>1 day ago</td>
                  <td><span class="status-badge pending">Pending</span></td>
                </tr>
                <tr>
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar">SW</div>
                      <div>
                        <div class="user-name">Sarah Williams</div>
                        <div class="user-email">sarah@example.com</div>
                      </div>
                    </div>
                  </td>
                  <td>Subscription</td>
                  <td>2 days ago</td>
                  <td><span class="status-badge success">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="right-column">
        <!-- Revenue Sources -->
        <div class="sources-card">
          <div class="card-header">
            <div>
              <h3>Revenue Sources</h3>
              <p class="card-subtitle">Breakdown by source</p>
            </div>
          </div>
          <div class="sources-list">
            <div class="source-item">
              <div class="source-info">
                <div class="source-icon web">🌐</div>
                <div>
                  <div class="source-name">Web</div>
                  <div class="source-value">$24,500</div>
                </div>
              </div>
              <div class="source-percentage">46%</div>
            </div>
            <div class="source-item">
              <div class="source-info">
                <div class="source-icon mobile">📱</div>
                <div>
                  <div class="source-name">Mobile</div>
                  <div class="source-value">$18,200</div>
                </div>
              </div>
              <div class="source-percentage">34%</div>
            </div>
            <div class="source-item">
              <div class="source-info">
                <div class="source-icon api">🔌</div>
                <div>
                  <div class="source-name">API</div>
                  <div class="source-value">$10,300</div>
                </div>
              </div>
              <div class="source-percentage">20%</div>
            </div>
          </div>
        </div>

        <!-- Geography Breakdown -->
        <div class="geo-card">
          <div class="card-header">
            <div>
              <h3>Top Countries</h3>
              <p class="card-subtitle">Revenue by geography</p>
            </div>
          </div>
          <div class="geo-list">
            <div class="geo-item">
              <div class="geo-info">
                <span class="geo-flag">🇺🇸</span>
                <span class="geo-name">United States</span>
              </div>
              <div class="geo-stats">
                <div class="geo-value">$230,900</div>
                <div class="geo-bar">
                  <div class="geo-bar-fill" style="width: 100%"></div>
                </div>
              </div>
            </div>
            <div class="geo-item">
              <div class="geo-info">
                <span class="geo-flag">🇩🇪</span>
                <span class="geo-name">Germany</span>
              </div>
              <div class="geo-stats">
                <div class="geo-value">$190,700</div>
                <div class="geo-bar">
                  <div class="geo-bar-fill" style="width: 82%"></div>
                </div>
              </div>
            </div>
            <div class="geo-item">
              <div class="geo-info">
                <span class="geo-flag">🇬🇧</span>
                <span class="geo-name">United Kingdom</span>
              </div>
              <div class="geo-stats">
                <div class="geo-value">$143,960</div>
                <div class="geo-bar">
                  <div class="geo-bar-fill" style="width: 62%"></div>
                </div>
              </div>
            </div>
            <div class="geo-item">
              <div class="geo-info">
                <span class="geo-flag">🇧🇷</span>
                <span class="geo-name">Brazil</span>
              </div>
              <div class="geo-stats">
                <div class="geo-value">$98,400</div>
                <div class="geo-bar">
                  <div class="geo-bar-fill" style="width: 42%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="stats-card">
          <div class="card-header">
            <h3>Quick Stats</h3>
          </div>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-label">Avg. Session</div>
              <div class="stat-value">4m 32s</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Bounce Rate</div>
              <div class="stat-value">24.5%</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Page Views</div>
              <div class="stat-value">12.4K</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Return Rate</div>
              <div class="stat-value">68.2%</div>
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

/* Page Header */
.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.page-title {
  font-family: 'Roboto', sans-serif;
  font-size: 32px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: #151515;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:hover {
  background: #1a1a1a;
  border-color: rgba(255, 255, 255, 0.2);
}

.action-button.primary {
  background: linear-gradient(310deg, #17ad37 0%, #17ad37 100%);
  border-color: #17ad37;
  color: white;
}

.action-button.primary:hover {
  background: linear-gradient(310deg, #15a033 0%, #15a033 100%);
  box-shadow: 0 4px 12px rgba(23, 173, 55, 0.3);
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: #151515;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.metric-card:hover {
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.metric-title {
  font-family: 'Inter', sans-serif;
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-icon.revenue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.metric-icon.users {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.metric-icon.customers {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.metric-icon.conversion {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.metric-value {
  font-family: 'Roboto', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.metric-change {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.8125rem;
  font-weight: 500;
}

.metric-change.positive {
  color: #43e97b;
}

.metric-change.negative {
  color: #f5576c;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 1.5rem;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Cards */
.chart-card,
.table-card,
.sources-card,
.geo-card,
.stats-card {
  background: #151515;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.card-header h3 {
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 0.25rem 0;
}

.card-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.view-all-link {
  background: none;
  border: none;
  color: #17ad37;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease;
}

.view-all-link:hover {
  color: #15a033;
  text-decoration: underline;
}

/* Chart */
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
.table-container {
  overflow-x: auto;
}

.activity-table {
  width: 100%;
  border-collapse: collapse;
}

.activity-table thead {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.activity-table th {
  text-align: left;
  padding: 0.75rem 0;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.activity-table td {
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  color: #ffffff;
}

.activity-table tbody tr:last-child td {
  border-bottom: none;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
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
  flex-shrink: 0;
}

.user-name {
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 0.125rem;
}

.user-email {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.6);
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.success {
  background: rgba(67, 233, 123, 0.2);
  color: #43e97b;
}

.status-badge.pending {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

/* Revenue Sources */
.sources-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.source-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  transition: background 0.2s ease;
}

.source-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.source-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.source-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  background: rgba(255, 255, 255, 0.05);
}

.source-name {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 0.25rem;
}

.source-value {
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
}

.source-percentage {
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

/* Geography */
.geo-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.geo-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.geo-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.geo-flag {
  font-size: 1.5rem;
}

.geo-name {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #ffffff;
}

.geo-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.geo-value {
  font-family: 'Roboto', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.geo-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
  overflow: hidden;
}

.geo-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #17ad37 0%, #43e97b 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Quick Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-item {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  text-align: center;
}

.stat-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-family: 'Roboto', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
}

@media (max-width: 1400px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
