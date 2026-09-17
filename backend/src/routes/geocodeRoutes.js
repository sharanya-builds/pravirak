import { Router } from 'express';
import { search, reverse } from '../controllers/geocodeController.js';

const router = Router();

router.get('/search', search);
router.get('/reverse', reverse);

export default router;
