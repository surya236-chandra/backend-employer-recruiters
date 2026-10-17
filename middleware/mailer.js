import nodemailer from 'nodemailer';

export async function sendApplicationConfirmation(applicant, job) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.info(`Application confirmation for ${applicant.email} — ${job.jobdesignation} at ${job.companyname} (configure SMTP to send email).`);
    return;
  }
  const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT) || 587, secure: process.env.SMTP_SECURE === 'true', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
  await transporter.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to: applicant.email, subject: `Application received: ${job.jobdesignation}`, text: `Hi ${applicant.name},\n\nYour application for ${job.jobdesignation} at ${job.companyname} has been received.\n\nThank you,\nEasily` });
}
