import { Router } from 'express';
import * as dashboardService from './dashboard.service.js';
import { optionalAuth } from '../../middleware/index.js';

const router = Router();

router.use(optionalAuth);

router.get('/stats', async (_req, res, next) => {
  try {
    const stats = await dashboardService.getStats();
    res.json(stats);
  } catch (e) {
    next(e);
  }
});

router.get('/activity', async (req, res, next) => {
  try {
    const limit = parseInt((req.query.limit as string) ?? '20', 10);
    const result = await dashboardService.getRecentActivity(limit);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
