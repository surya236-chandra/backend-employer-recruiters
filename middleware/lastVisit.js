export function trackLastVisit(req, res, next) {
  const previousVisit = req.cookies?.lastVisit;
  res.locals.lastVisit = null;
  res.cookie('lastVisit', new Date().toISOString(), { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 * 365 });
  if (previousVisit) {
    const date = new Date(previousVisit);
    res.locals.lastVisit = Number.isNaN(date.valueOf()) ? null : date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  }
  next();
}
