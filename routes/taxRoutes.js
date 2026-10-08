import express from 'express';
import { calculateTax, getHistory, compareRegimesHandler, getCalculationById } from '../controllers/taxController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/calculate-tax', calculateTax);
router.get('/history', requireAuth, getHistory);
router.post('/compare-regimes', compareRegimesHandler);
router.get('/calculation/:id', getCalculationById);

export default router;