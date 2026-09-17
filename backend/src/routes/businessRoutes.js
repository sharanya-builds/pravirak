import { Router } from 'express';
import { index, show, save, destroy } from '../controllers/businessController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/', index);
router.get('/:id', show);
router.post('/', save);
router.delete('/:id', destroy);

export default router;
