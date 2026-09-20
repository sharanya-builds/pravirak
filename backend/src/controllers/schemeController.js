import { recommendSchemes } from '../services/openRouterSchemeService.js';

export async function recommend(req, res, next) {
  try {
    const { businessIdea, category, ownCapital, city, state, language = 'en' } = req.body || {};
    if (!businessIdea || !ownCapital) {
      return res.status(400).json({ error: 'businessIdea and ownCapital are required.' });
    }
    const result = await recommendSchemes({ businessIdea, category, ownCapital, city, state, language });
    res.json(result);
  } catch (err) {
    next(err);
  }
}
