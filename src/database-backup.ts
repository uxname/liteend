/* eslint-disable sonarjs/os-command,security/detect-child-process,security/detect-non-literal-fs-filename,unicorn/prefer-top-level-await */
import * as childProcess from 'node:child_process';
import * as fs from 'node:fs';
import path from 'node:path';

import { Logger } from '@/common/logger/logger';

const logger = new Logger('DatabaseBackup');

// Environment variables with types
const DATABASE_HOST: string = process.env.DATABASE_HOST || 'localhost';
const DATABASE_PORT: string = process.env.DATABASE_PORT || '5002';
const DATABASE_USER: string = process.env.DATABASE_USER || 'postgres';
const DATABASE_PASSWORD: string = process.env.DATABASE_PASSWORD || 'postgres';
const DATABASE_NAME: string = process.env.DATABASE_NAME || 'postgres';
const BACKUP_DIR: string = process.env.BACKUP_DIR || './data/database_backups';
const BACKUP_INTERVAL: number = Number.parseInt(
  process.env.BACKUP_INTERVAL || '2000',
  10,
); // 1 day in milliseconds
const BACKUP_ROTATION: number = Number.parseInt(
  process.env.BACKUP_ROTATION || '5',
  10,
);

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

let isBackingUp: boolean = false;

// Function to create a backup
async function createBackup(): Promise<void> {
  if (isBackingUp) {
    logger.log('Another backup is already in progress. Skipping this backup.');
    return;
  }
  isBackingUp = true;

  try {
    const timestamp: string = new Date()
      .toISOString()
      .replaceAll(':', '-')
      .replaceAll('.', '_');
    const backupFileName: string = `${DATABASE_NAME}_${timestamp}.sql.gz`;
    const backupFilePath: string = path.join(BACKUP_DIR, backupFileName);

    const pgDumpPath: string = 'pg_dump';

    const pgDumpOptions: string[] = [
      `-h ${DATABASE_HOST}`,
      `-p ${DATABASE_PORT}`,
      `-U ${DATABASE_USER}`,
      `-d ${DATABASE_NAME}`,
      '-F c', // Custom format
      '-b', // Include large objects
      '-v', // Verbose mode
    ];

    const dumpCommand: string = `${pgDumpPath} ${pgDumpOptions.join(' ')} | gzip > ${backupFilePath}`;

    logger.log(`Starting backup: ${backupFilePath}`);
    await new Promise<void>((resolve, reject) => {
      childProcess.exec(
        dumpCommand,
        { env: { ...process.env, PGPASSWORD: DATABASE_PASSWORD } },
        (error) => {
          if (error) {
            logger.error('Backup failed:', error);
            reject(error);
          } else {
            logger.log('Backup completed successfully.');
            resolve();
          }
        },
      );
    });

    rotateBackups();
  } catch (error) {
    logger.error('Error during backup:', error);
  } finally {
    isBackingUp = false;
  }
}

// Function to rotate backups
function rotateBackups(): void {
  try {
    const files: string[] = fs
      .readdirSync(BACKUP_DIR)
      .filter((file) => file.endsWith('.sql.gz'));

    files.sort((a, b) => {
      const aTime: number = fs
        .statSync(path.join(BACKUP_DIR, a))
        .mtime.getTime();
      const bTime: number = fs
        .statSync(path.join(BACKUP_DIR, b))
        .mtime.getTime();
      return aTime - bTime;
    });

    if (files.length > BACKUP_ROTATION) {
      const filesToDelete: string[] = files.slice(
        0,
        files.length - BACKUP_ROTATION,
      );
      for (const file of filesToDelete) {
        const filePath: string = path.join(BACKUP_DIR, file);
        fs.unlinkSync(filePath);
        logger.log(`Deleted old backup: ${filePath}`);
      }
    }
  } catch (error) {
    logger.error('Error during backup rotation:', error);
  }
}

// Initial backup on script start
createBackup().catch((error) => {
  logger.error('Error during initial backup:', error);
  throw error;
});

// Schedule backups at the specified interval
setInterval(createBackup, BACKUP_INTERVAL);
