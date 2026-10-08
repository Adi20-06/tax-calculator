import express from 'express';
import { saveProfile, getProfiles, deleteProfile } from '../controllers/profileController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateProfile, validateIdParam } from '../middleware/validators.js';

const router = express.Router();

router.use(requireAuth);
router.post('/', validateProfile, saveProfile);
router.get('/', getProfiles);
router.delete('/:id', validateIdParam, deleteProfile);

export default router;