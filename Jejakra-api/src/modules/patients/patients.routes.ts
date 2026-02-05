import { Router } from 'express';
import { z } from 'zod';
import * as patientsService from './patients.service.js';
import { authMiddleware, optionalAuth } from '../../middleware/index.js';
import { logActivity } from '../dashboard/activity.service.js';

const router = Router();

// Use optional auth for now - frontend may not send token initially; can tighten later
router.use(optionalAuth);

const createPatientSchema = z.object({
  name: z.string().min(1),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  age: z.union([z.number(), z.string()]).optional(),
  address: z.string().optional(),
  contactNumber: z.string().optional(),
  disease: z.string().optional(),
  status: z.enum(['Active', 'Inactive', 'New', 'Archived', 'Pending']).optional(),
  registeredDate: z.string().optional(),
  details: z.record(z.unknown()).optional(),
});

const updatePatientSchema = createPatientSchema.partial();

router.get('/', async (req, res, next) => {
  try {
    const search = (req.query.search as string) ?? '';
    const gender = (req.query.gender as string) ?? '';
    const status = (req.query.status as string) ?? '';
    const page = parseInt((req.query.page as string) ?? '1', 10);
    const limit = parseInt((req.query.limit as string) ?? '50', 10);

    const result = await patientsService.listPatients({ search, gender, status, page, limit });
    // Frontend expects array directly for getAll - check api.js: getAll: () => fetchWithError('/patients')
    // The frontend patientApi.getAll() returns the response as-is. The hooks use mock data.
    // For compatibility, we could return either { data, total, ... } or just data.
    // Design doc says support pagination - so returning paginated format is correct.
    // Frontend may need updates to use result.data - but for now let's also support
    // returning just the array when no pagination params, for easier drop-in.
    const wantsPaginated = req.query.page != null || req.query.limit != null;
    if (wantsPaginated) {
      res.json(result);
    } else {
      const all = await patientsService.listPatients({ search, gender, status, page: 1, limit: 1000 });
      res.json(all.data);
    }
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const patient = await patientsService.getPatientById(req.params.id);
    res.json(patient);
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = createPatientSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
      return;
    }
    const userId = (req as typeof req & { userId?: string }).userId;
    const patient = await patientsService.createPatient(parsed.data, userId);
    await logActivity('patient', patient.id, 'created', userId, { name: patient.name });
    res.status(201).json(patient);
  } catch (e) {
    next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const parsed = updatePatientSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
      return;
    }
    const userId = (req as typeof req & { userId?: string }).userId;
    const patient = await patientsService.updatePatient(req.params.id, parsed.data);
    await logActivity('patient', patient.id, 'updated', userId, { name: patient.name });
    res.json(patient);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const userId = (req as typeof req & { userId?: string }).userId;
    await patientsService.deletePatient(req.params.id);
    await logActivity('patient', req.params.id, 'deleted', userId, {});
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

export default router;
