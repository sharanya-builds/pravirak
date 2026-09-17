import { Router } from 'express';
import { index, create } from '../controllers/reportController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/', index);
router.post('/', create);

export default router;
