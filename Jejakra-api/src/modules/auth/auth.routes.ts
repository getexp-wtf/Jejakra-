import { Router } from 'express';
import { z } from 'zod';
import * as authService from './auth.service.js';
import { authMiddleware } from '../../middleware/index.js';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  role: z.enum(['doctor', 'user', 'admin']).optional(),
});

const profileSchema = z.object({
  name: z.string().min(1).optional(),
  avatar: z.string().nullable().optional(),
});

router.post('/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
      return;
    }
    const result = await authService.login(parsed.data.email, parsed.data.password);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
      return;
    }
    const result = await authService.register(parsed.data);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
});

router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as typeof req & { userId: string }).userId;
    const user = await authService.getMe(userId);
    res.json(user);
  } catch (e) {
    next(e);
  }
});

router.patch('/profile', authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as typeof req & { userId: string }).userId;
    const parsed = profileSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
      return;
    }
    const user = await authService.updateProfile(userId, parsed.data);
    res.json(user);
  } catch (e) {
    next(e);
  }
});

export default router;
