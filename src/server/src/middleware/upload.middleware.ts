import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AppError } from './errorHandler';

// Temporary staging directory — files are moved to final storage by StorageService
const STAGING_DIR = path.resolve(process.cwd(), 'uploads', '.staging');

if (!fs.existsSync(STAGING_DIR)) {
  fs.mkdirSync(STAGING_DIR, { recursive: true });
}

const ALLOWED_MIMES = ['application/pdf', 'text/plain', 'image/png', 'image/jpeg'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, STAGING_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

/**
 * Multer middleware configured for file uploads.
 * Restricts files to PDF, TXT, PNG, and JPG up to 10MB.
 */
export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          'File format not allowed. Accepted: .pdf, .txt, .png, .jpg',
          400,
          'INVALID_FILE_TYPE'
        )
      );
    }
  },
});
