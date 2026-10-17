# Easily Job Portal

A small job portal for job seekers and recruiters, built with Express MVC, EJS, ES modules, session authentication, and in-memory data.

## Run locally

1. Install Node.js 18 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set a unique `SESSION_SECRET`.
4. Run `npm start` and open `http://localhost:3000`.

Recruiters can create an account at `/register`. Public visitors can browse and apply without an account. Job seekers may attach PDF, DOC, or DOCX resumes up to 5 MB. Resume files are stored in `uploads/resumes` and linked to each application.

To send real confirmation email, fill in `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `MAIL_FROM` in `.env`. When SMTP is not configured, the application is still recorded and a confirmation notice is logged to the server console.

## Routes

### Authentication

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/login` | Show recruiter login form |
| POST | `/login` | Authenticate recruiter |
| GET | `/register` | Show recruiter registration form |
| POST | `/register` | Create recruiter account |
| POST | `/logout` | End recruiter session |

### Jobs and applications

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/jobs` | Browse, search, and paginate job listings |
| GET | `/jobs/new` | Show new job form (recruiter) |
| POST | `/jobs` | Create job (recruiter) |
| GET | `/jobs/:id` | View job details |
| GET | `/jobs/:id/update` | Show edit form (owner) |
| POST | `/jobs/:id/update` | Update job (owner) |
| GET or POST | `/jobs/:id/delete` | Delete job (owner; POST is preferred) |
| POST | `/apply/:id` | Apply with contact details and resume upload |
| GET | `/jobs/:id/applicants` | View applicants (owner) |
| POST | `/jobs/:id/applicants` | Add applicant record (owner/API) |
| GET | `/jobs/:id/applicants/:applicantId` | Retrieve applicant JSON (owner/API) |
| PUT | `/jobs/:id/applicants/:applicantId` | Update applicant JSON (owner/API) |
| DELETE | `/jobs/:id/applicants/:applicantId` | Delete applicant (owner/API) |

HTML forms use `POST` for job updates and deletes; the applicant API also accepts `PUT` and `DELETE` and supports method override via `_method` for browser forms.

## Project structure

- `models/` — in-memory user and job data operations
- `controllers/` — request handlers
- `routes/` — authentication and job route definitions
- `middleware/` — recruiter authentication, validation, uploads, visit tracking, and email
- `views/` — EJS pages and shared partials
- `public/` — responsive styles
- `uploads/resumes/` — uploaded applicant resumes

All user and job records are in memory and reset when the server restarts. This project is intended as a learning/demo app; use persistent storage, a production session store, CSRF protection, and private resume access before production deployment.
