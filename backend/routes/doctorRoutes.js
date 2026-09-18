import { Router } from 'express';
import {
  bookAppointment,
  getDoctors,
  getSlots,
} from '../controllers/doctorController.js';

const router = Router();

router.get('/doctors', getDoctors);
router.get('/slots', getSlots);
router.post('/appointments', bookAppointment);

export default router;
