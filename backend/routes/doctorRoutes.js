import { Router } from 'express';
import {
  bookAppointment,
  getDoctors,
  getSlots,
} from '../controllers/doctorController.js';
import { validateCredentionls } from '../middlewares/validateCredentials.js';

const router = Router();

router.get('/doctors', getDoctors);
router.get('/slots', getSlots);
router.post('/appointments', validateCredentionls, bookAppointment);

export default router;
