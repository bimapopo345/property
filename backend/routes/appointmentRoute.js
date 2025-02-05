import express from 'express';
import { scheduleViewing } from '../controller/appointmentController.js';
import { protect } from '../middleware/authmiddleware.js'

const router = express.Router();

router.post('/schedule', protect, scheduleViewing);

export default router;