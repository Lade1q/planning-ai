import fs from 'fs';
import path from 'path';

/**
 * Abstract interface for file storage operations.
 * MVP uses LocalStorageService; production will use R2StorageService.
 */
export interface StorageService {
  /** Upload a file and return a storage key (relative, portable). */
  upload(localFilePath: string, destinationKey: string): Promise<string>;
  /** Delete a file by its storage key. */
  delete(fileKey: string): Promise<void>;
}

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');

/**
 * Local filesystem storage for MVP/development.
 * Uses async non-blocking file operations and supports cross-device migrations.
 */
export class LocalStorageService implements StorageService {
  async upload(localFilePath: string, destinationKey: string): Promise<string> {
    const destPath = path.join(UPLOAD_DIR, destinationKey);
    const destDir = path.dirname(destPath);

    // Ensure parent directory exists
    await fs.promises.mkdir(destDir, { recursive: true });

    // Copy + Unlink to prevent EXDEV errors when staging is on a different partition
    await fs.promises.copyFile(localFilePath, destPath);
    await fs.promises.unlink(localFilePath);

    return destinationKey;
  }

  async delete(fileKey: string): Promise<void> {
    const filePath = path.join(UPLOAD_DIR, fileKey);
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      // Ignore if file does not exist (ENOENT)
      if (error && typeof error === 'object' && 'code' in error && error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}

// Future Sprint 4: Cloudflare R2 Storage Service Stub
// export class R2StorageService implements StorageService {
//   private s3: S3Client;
//   constructor() {
//     this.s3 = new S3Client({
//       region: 'auto',
//       endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
//       credentials: {
//         accessKeyId: process.env.R2_ACCESS_KEY_ID!,
//         secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
//       },
//     });
//   }
//   async upload(localFilePath: string, destinationKey: string): Promise<string> { ... }
//   async delete(fileKey: string): Promise<void> { ... }
// }

/**
 * Factory: returns the appropriate StorageService based on environment.
 */
export function createStorageService(): StorageService {
  // Sprint 4: if (process.env.STORAGE_PROVIDER === 'r2') return new R2StorageService();
  return new LocalStorageService();
}
