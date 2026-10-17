import { User } from '../models/user.js';

export function showLogin(req, res) { res.render('pages/login', { title: 'Recruiter login', errors: [], values: {} }); }
export function showRegister(req, res) { res.render('pages/register', { title: 'Create recruiter account', errors: [], values: {} }); }

export async function register(req, res, next) {
  const values = { name: String(req.body.name || '').trim(), email: String(req.body.email || '').trim() };
  const password = String(req.body.password || '');
  const errors = [];
  if (values.name.length < 2 || values.name.length > 80) errors.push('Name must be between 2 and 80 characters.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.push('Enter a valid email address.');
  if (password.length < 8) errors.push('Password must be at least 8 characters.');
  if (password !== req.body.confirmPassword) errors.push('Passwords do not match.');
  if (errors.length) return res.status(400).render('pages/register', { title: 'Create recruiter account', errors, values });
  try {
    req.session.user = await User.create({ ...values, password });
    res.redirect('/jobs');
  } catch (error) {
    if (error.message.includes('already exists')) return res.status(409).render('pages/register', { title: 'Create recruiter account', errors: [error.message], values });
    next(error);
  }
}

export async function login(req, res) {
  const email = String(req.body.email || '');
  const user = await User.authenticate(email, String(req.body.password || ''));
  if (!user) return res.status(401).render('pages/login', { title: 'Recruiter login', errors: ['Email or password is incorrect.'], values: { email } });
  const destination = req.session.returnTo || '/jobs';
  delete req.session.returnTo;
  req.session.user = user;
  res.redirect(destination);
}

export function logout(req, res, next) { req.session.destroy(error => { if (error) return next(error); res.clearCookie('easily.sid'); res.redirect('/'); }); }
