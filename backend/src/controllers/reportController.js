import { listReports, createReport } from '../services/reportService.js';

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
