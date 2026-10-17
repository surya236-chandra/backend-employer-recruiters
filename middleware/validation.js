const requiredJobFields = ['jobcategory', 'jobdesignation', 'joblocation', 'companyname', 'salary', 'applyby'];

export function validateJob(req, res, next) {
  const fields = Object.fromEntries(requiredJobFields.map(key => [key, String(req.body[key] || '').trim()]));
  const skillsrequired = String(req.body.skillsrequired || '').split(',').map(skill => skill.trim()).filter(Boolean);
  const numberofopenings = Number(req.body.numberofopenings);
  const errors = [];
  for (const key of requiredJobFields) if (!fields[key]) errors.push(`${key} is required.`);
  if (fields.applyby && Number.isNaN(Date.parse(fields.applyby))) errors.push('Enter a valid application deadline.');
  if (!Number.isInteger(numberofopenings) || numberofopenings < 1) errors.push('Openings must be a whole number greater than zero.');
  if (fields.salary.length > 100 || fields.jobdesignation.length > 120 || fields.companyname.length > 120) errors.push('One or more fields exceed the allowed length.');
  if (errors.length) return res.status(400).render('pages/job-form', { title: req.job ? 'Update job' : 'Post a job', job: req.job || fields, errors, formAction: req.job ? `/jobs/${req.job.id}/update` : '/jobs', isEdit: Boolean(req.job) });
  req.validatedJob = { ...fields, numberofopenings, skillsrequired };
  next();
}

export function validateApplicant(req, res, next) {
  const { name = '', email = '', contact = '' } = req.body;
  const errors = [];
  if (!String(name).trim()) errors.push('Name is required.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) errors.push('Enter a valid email address.');
  if (!/^[+\d().\s-]{7,20}$/.test(String(contact).trim())) errors.push('Enter a valid contact number.');
  if (!req.file) errors.push('Please attach a PDF, DOC, or DOCX resume (up to 5 MB).');
  if (errors.length) return res.status(400).render('pages/job-detail', { title: 'Apply for job', job: req.job, errors });
  req.applicantFields = { name: String(name).trim(), email: String(email).trim(), contact: String(contact).trim(), resumePath: `/uploads/resumes/${req.file.filename}`, resumeName: req.file.originalname };
  next();
}
