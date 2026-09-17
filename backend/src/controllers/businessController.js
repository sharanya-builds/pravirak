import {
  listBusinesses,
  getBusiness,
  upsertBusiness,
  deleteBusiness
} from '../services/businessService.js';

export async function index(req, res, next) {
  try {
    res.json({ businesses: await listBusinesses(req.user.id) });
  } catch (err) {
    next(err);
  }
}

export async function show(req, res, next) {
  try {
    res.json({ business: await getBusiness(req.user.id, Number(req.params.id)) });
  } catch (err) {
    next(err);
  }
}

export async function save(req, res, next) {
  try {
    const business = await upsertBusiness(req.user.id, req.body);
    res.status(201).json({ business });
  } catch (err) {
    next(err);
  }
}

export async function destroy(req, res, next) {
  try {
    res.json(await deleteBusiness(req.user.id, Number(req.params.id)));
  } catch (err) {
    next(err);
  }
}
