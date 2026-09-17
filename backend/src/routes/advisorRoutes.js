import { Router } from 'express';
import { answerAdvisorQuestion } from '../services/openRouterAdvisorService.js';

const router = Router();

router.post('/ask', async (req, res) => {
  try {
    const result = await answerAdvisorQuestion(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to process advisor query',
      details: err.message
    });
  }
});

export default router;
