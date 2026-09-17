import { Router } from 'express';
import { recommend } from '../controllers/schemeController.js';

const router = Router();

// Intentionally not behind requireAuth: guests need scheme lookups too, and
// this endpoint is read-only / stateless (no user data is touched or stored).
router.post('/recommend', recommend);

export default router;
