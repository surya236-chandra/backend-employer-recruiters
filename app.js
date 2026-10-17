import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import { trackLastVisit } from './middleware/lastVisit.js';

const app = express();
const here = path.dirname(fileURLToPath(import.meta.url));
app.set('view engine', 'ejs');
app.set('views', path.join(here, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
  name: 'easily.sid',
  secret: process.env.SESSION_SECRET || 'development-only-change-this-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 8 }
}));
app.use(trackLastVisit);
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.currentPath = req.path;
  next();
});
app.use('/public', express.static(path.join(here, 'public')));
app.use('/uploads', express.static(path.join(here, 'uploads'), { fallthrough: false, setHeaders(res) { res.setHeader('X-Content-Type-Options', 'nosniff'); } }));

app.get('/', (req, res) => res.render('pages/landing', { title: 'Find work that fits' }));
app.get('/404', (req, res) => res.status(404).render('pages/404', { title: 'Page not found' }));
app.use('/', authRoutes);
app.use('/', jobRoutes);
app.use((req, res) => res.status(404).render('pages/404', { title: 'Page not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).render('pages/error', { title: 'Upload too large', message: 'Your resume must be 5 MB or smaller.' });
  if (err.message === 'Only PDF, DOC, and DOCX resumes are accepted.') return res.status(400).render('pages/error', { title: 'Unsupported resume', message: err.message });
  res.status(err.status || 500).render('pages/error', { title: 'Something went wrong', message: err.status ? err.message : 'Please try again in a moment.' });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`Easily is running at http://localhost:${port}`));
