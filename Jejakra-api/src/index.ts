import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { authRoutes } from './modules/auth/index.js';
import { patientsRoutes } from './modules/patients/index.js';
import { appointmentsRoutes } from './modules/appointments/index.js';
import { dashboardRoutes } from './modules/dashboard/index.js';
import { errorHandler } from './middleware/index.js';
import { env } from './config/index.js';

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many attempts, try again later' },
});

app.use('/auth', authLimiter, authRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Jejakra API running at http://localhost:${env.port}`);
});
