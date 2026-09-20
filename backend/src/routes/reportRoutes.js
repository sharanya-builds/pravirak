import { Router } from 'express';
import { index, create, generateLocalFeasibilityReportHandler } from '../controllers/reportController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Public / session feasibility analysis (does not require login token)
router.post('/local-feasibility', generateLocalFeasibilityReportHandler);

// Saved persistent business reports (require user account)
router.use(requireAuth);
router.get('/', index);
router.post('/', create);

export default router;
