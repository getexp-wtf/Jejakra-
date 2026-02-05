import { Router } from 'express';
import { z } from 'zod';
import * as appointmentsService from './appointments.service.js';
import { optionalAuth } from '../../middleware/index.js';
import { logActivity } from '../dashboard/activity.service.js';

const router = Router();

router.use(optionalAuth);

const createAppointmentSchema = z.object({
  patient_id: z.string().uuid(),
  appointment_type: z.enum(['Consultation', 'Follow Up', 'Routine Check-up']),
  session_type: z.string().optional(),
  date: z.string(),
  time: z.string(),
  visit_type: z.enum(['In-person', 'Virtual']),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

const updateAppointmentSchema = z.object({
  appointment_type: z.enum(['Consultation', 'Follow Up', 'Routine Check-up']).optional(),
  session_type: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  visit_type: z.enum(['In-person', 'Virtual']).optional(),
  status: z.enum(['Scheduled', 'Ongoing', 'Completed', 'Cancelled', 'No show']).optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/appointments/patient/:patientId must be defined before /:id
router.get('/patient/:patientId', async (req, res, next) => {
  try {
    const appointments = await appointmentsService.getAppointmentsByPatientId(req.params.patientId);
    res.json(appointments);
  } catch (e) {
    next(e);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const date = req.query.date as string;
    const patientId = req.query.patientId as string;
    const status = req.query.status as string;
    const page = parseInt((req.query.page as string) ?? '1', 10);
    const limit = parseInt((req.query.limit as string) ?? '50', 10);

    const result = await appointmentsService.listAppointments({
      date,
      patientId,
      status,
      page,
      limit,
    });

    const wantsPaginated = req.query.page != null || req.query.limit != null;
    if (wantsPaginated) {
      res.json(result);
    } else {
      const all = await appointmentsService.listAppointments({
        date,
        patientId,
        status,
        page: 1,
        limit: 1000,
      });
      res.json(all.data);
    }
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const appointment = await appointmentsService.getAppointmentById(req.params.id);
    res.json(appointment);
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = createAppointmentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
      return;
    }
    const userId = (req as typeof req & { userId?: string }).userId;
    if (!parsed.data.patient_id && !parsed.data.patientName) {
      res.status(400).json({ error: 'patient_id or patientName is required' });
      return;
    }
    const appointment = await appointmentsService.createAppointment(parsed.data, userId);
    await logActivity('appointment', appointment.id, 'created', userId, {
      name: appointment.patientName,
    });
    res.status(201).json(appointment);
  } catch (e) {
    next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const parsed = updateAppointmentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
      return;
    }
    const userId = (req as typeof req & { userId?: string }).userId;
    const appointment = await appointmentsService.updateAppointment(req.params.id, parsed.data);
    await logActivity('appointment', appointment.id, 'updated', userId, {
      name: appointment.patientName,
    });
    res.json(appointment);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const userId = (req as typeof req & { userId?: string }).userId;
    await appointmentsService.deleteAppointment(req.params.id);
    await logActivity('appointment', req.params.id, 'deleted', userId, {});
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

export default router;
