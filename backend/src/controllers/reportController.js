import { listReports, createReport } from '../services/reportService.js';
import { generateLocalFeasibilityReport } from '../services/localFeasibilityService.js';

export async function generateLocalFeasibilityReportHandler(req, res, next) {
  try {
    const {
      category,
      location,
      ownCapital,
      competitorCount,
      catchmentPopulationEstimate,
      projectCost,
      language
    } = req.body;

    const report = await generateLocalFeasibilityReport({
      category,
      location,
      ownCapital: typeof ownCapital === 'number' ? ownCapital : Number(ownCapital) || 0,
      competitorCount: typeof competitorCount === 'number' ? competitorCount : Number(competitorCount) || 0,
      catchmentPopulationEstimate: catchmentPopulationEstimate ? Number(catchmentPopulationEstimate) : null,
      projectCost: typeof projectCost === 'number' ? projectCost : Number(projectCost) || 0,
      language: ['en', 'hi', 'te'].includes(language) ? language : 'en'
    });

    res.json(report);
  } catch (err) {
    next(err);
  }
}

export async function index(req, res, next) {
  try {
    res.json({ reports: await listReports(req.user.id) });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const report = await createReport(req.user.id, req.body);
    res.status(201).json({ report });
  } catch (err) {
    next(err);
  }
}
