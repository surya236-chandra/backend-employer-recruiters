import { randomUUID } from 'node:crypto';

const jobs = [];

export const Job = {
  all({ search = '', page = 1, limit = 8 } = {}) {
    const query = search.trim().toLowerCase();
    const filtered = jobs.filter(job => !query || [job.jobcategory, job.jobdesignation, job.joblocation, job.companyname, ...job.skillsrequired].join(' ').toLowerCase().includes(query));
    const pages = Math.max(1, Math.ceil(filtered.length / limit));
    const safePage = Math.min(Math.max(Number(page) || 1, 1), pages);
    return { jobs: filtered.slice((safePage - 1) * limit, safePage * limit), page: safePage, pages, total: filtered.length, search };
  },
  find(id) { return jobs.find(job => job.id === id) || null; },
  create(fields, recruiterId) {
    const job = { id: randomUUID(), ...fields, recruiterId, applicants: [], jobposted: new Date().toISOString() };
    jobs.unshift(job);
    return job;
  },
  update(id, fields) { const job = this.find(id); if (!job) return null; Object.assign(job, fields); return job; },
  remove(id) { const index = jobs.findIndex(job => job.id === id); if (index < 0) return false; jobs.splice(index, 1); return true; },
  addApplicant(job, fields) {
    const applicant = { applicantId: randomUUID(), ...fields, appliedAt: new Date().toISOString() };
    job.applicants.push(applicant);
    return applicant;
  },
  findApplicant(job, applicantId) { return job.applicants.find(applicant => applicant.applicantId === applicantId) || null; },
  updateApplicant(job, applicantId, fields) { const applicant = this.findApplicant(job, applicantId); if (!applicant) return null; Object.assign(applicant, fields); return applicant; },
  removeApplicant(job, applicantId) { const index = job.applicants.findIndex(applicant => applicant.applicantId === applicantId); if (index < 0) return false; job.applicants.splice(index, 1); return true; }
};
