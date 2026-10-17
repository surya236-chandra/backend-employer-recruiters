import multer from 'multer';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'uploads', 'resumes');
fs.mkdirSync(dir, { recursive: true });
const storage = multer.diskStorage({ destination: dir, filename(req, file, callback) { callback(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`); } });
export const resumeUpload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter(req, file, callback) {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = ['.pdf', '.doc', '.docx'];
  if (!allowed.includes(ext)) return callback(new Error('Only PDF, DOC, and DOCX resumes are accepted.'));
  callback(null, true);
} });
