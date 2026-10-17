export function requireRecruiter(req, res, next) {
  if (req.session.user) return next();
  req.session.returnTo = req.originalUrl;
  return res.redirect('/login');
}

export function redirectIfAuthenticated(req, res, next) {
  if (req.session.user) return res.redirect('/jobs');
  next();
}

export function requireJobOwner(req, res, next) {
  const job = req.job;
  if (job && job.recruiterId === req.session.user?.id) return next();
  return res.status(job ? 403 : 404).render(job ? 'pages/error' : 'pages/404', { title: job ? 'Access denied' : 'Job not found', message: job ? 'Only the recruiter who posted this job can manage it.' : undefined });
}
