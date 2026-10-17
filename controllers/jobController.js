import { Job } from '../models/job.js';
import { sendApplicationConfirmation } from '../middleware/mailer.js';

export function listJobs(req, res) { res.render('pages/jobs', { title: 'Explore jobs', ...Job.all({ search: String(req.query.q || ''), page: req.query.page }) }); }
export function showJob(req, res) { res.render('pages/job-detail', { title: req.job.jobdesignation, job: req.job, errors: [] }); }
export function showCreateForm(req, res) { res.render('pages/job-form', { title: 'Post a job', job: {}, errors: [], formAction: '/jobs', isEdit: false }); }
export function createJob(req, res) { Job.create(req.validatedJob, req.session.user.id); res.redirect('/jobs?posted=1'); }
export function showUpdateForm(req, res) { res.render('pages/job-form', { title: 'Update job', job: req.job, errors: [], formAction: `/jobs/${req.job.id}/update`, isEdit: true }); }
export function updateJob(req, res) { Job.update(req.job.id, req.validatedJob); res.redirect(`/jobs/${req.job.id}`); }
export function deleteJob(req, res) { Job.remove(req.job.id); res.redirect('/jobs'); }
export function loadJob(req, res, next) { req.job = Job.find(req.params.id); if (!req.job) return res.status(404).render('pages/404', { title: 'Job not found' }); next(); }
export async function apply(req, res, next) {
  const applicant = Job.addApplicant(req.job, req.applicantFields);
  try { await sendApplicationConfirmation(applicant, req.job); }
  catch (error) { console.error('Could not send application confirmation:', error.message); }
  res.render('pages/application-success', { title: 'Application received', job: req.job, applicant });
}
export function listApplicants(req, res) { res.render('pages/applicants', { title: 'Applicants', job: req.job, applicants: req.job.applicants, errors: [] }); }
export function getApplicant(req, res) { const applicant = Job.findApplicant(req.job, req.params.applicantId); if (!applicant) return res.status(404).json({ error: 'Applicant not found.' }); res.json(applicant); }
export function createApplicant(req, res) { const applicant = Job.addApplicant(req.job, { name: String(req.body.name || '').trim(), email: String(req.body.email || '').trim(), contact: String(req.body.contact || '').trim(), resumePath: req.body.resumePath || '', resumeName: '' }); res.status(201).json(applicant); }
export function updateApplicant(req, res) { const applicant = Job.updateApplicant(req.job, req.params.applicantId, { name: String(req.body.name || '').trim(), email: String(req.body.email || '').trim(), contact: String(req.body.contact || '').trim() }); if (!applicant) return res.status(404).json({ error: 'Applicant not found.' }); res.json(applicant); }
export function deleteApplicant(req, res) { if (!Job.removeApplicant(req.job, req.params.applicantId)) return res.status(404).json({ error: 'Applicant not found.' }); res.status(204).end(); }
