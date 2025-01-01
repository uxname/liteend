/* eslint-disable sonarjs/os-command,unicorn/no-await-expression-member,security/detect-non-literal-fs-filename,unicorn/prefer-top-level-await,security/detect-child-process */
import * as childProcess from 'node:child_process';
import * as fs from 'node:fs/promises';
import path from 'node:path';

import { Logger } from '@/common/logger/logger';

const logger = new Logger('DatabaseBackup');

// Environment variables with strict types
interface EnvironmentVariables {
  DATABASE_HOST: string;
  DATABASE_PORT: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  BACKUP_DIR: string;
  BACKUP_INTERVAL: number;
  BACKUP_ROTATION: number;
  BACKUP_FORMAT: 'custom' | 'plain';
  BACKUP_COMPRESS: boolean;
}

const environment: EnvironmentVariables = {
  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
  DATABASE_PORT: process.env.DATABASE_PORT || '5002',
  DATABASE_USER: process.env.DATABASE_USER || 'postgres',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'postgres',
  DATABASE_NAME: process.env.DATABASE_NAME || 'postgres',
  BACKUP_DIR: process.env.BACKUP_DIR || './data/database_backups',
  BACKUP_INTERVAL: Number.parseInt(
    process.env.BACKUP_INTERVAL || '86400000',
    10,
  ), // 1 day in milliseconds
  BACKUP_ROTATION: Number.parseInt(process.env.BACKUP_ROTATION || '5', 10),
  BACKUP_FORMAT: (process.env.BACKUP_FORMAT === 'custom'
    ? 'custom'
    : 'plain') as 'custom' | 'plain',
  BACKUP_COMPRESS: process.env.BACKUP_COMPRESS === 'true',
};

logger.error('Environment variables:', environment);

// Ensure backup directory exists
async function ensureBackupDirectoryExists(): Promise<void> {
  try {
    await fs.access(environment.BACKUP_DIR);
  } catch {
    await fs.mkdir(environment.BACKUP_DIR, { recursive: true });
    logger.log(`Created backup directory: ${environment.BACKUP_DIR}`);
  }
}

let isBackingUp: boolean = false;

// Function to create a backup
async function createBackup(): Promise<void> {
  if (isBackingUp) {
    logger.warn('Another backup is already in progress. Skipping this backup.');
    return;
  }
  isBackingUp = true;

  try {
    const timestamp: string = new Date().toISOString().replaceAll(/[:.]/g, '-');
    const backupFileName: string = `${environment.DATABASE_NAME}_${timestamp}.${
      environment.BACKUP_COMPRESS ? 'sql.gz' : 'sql'
    }`;
    const backupFilePath: string = path.join(
      environment.BACKUP_DIR,
      backupFileName,
    );

    const pgDumpOptions: string[] = [
      `-h ${environment.DATABASE_HOST}`,
      `-p ${environment.DATABASE_PORT}`,
      `-U ${environment.DATABASE_USER}`,
      `-d ${environment.DATABASE_NAME}`,
      environment.BACKUP_FORMAT === 'custom' ? '-F c' : '-F p', // Custom or plain format
      '-b', // Include large objects
      '-v', // Verbose mode
    ];

    const dumpCommand: string = environment.BACKUP_COMPRESS
      ? `pg_dump ${pgDumpOptions.join(' ')} | gzip > ${backupFilePath}`
      : `pg_dump ${pgDumpOptions.join(' ')} > ${backupFilePath}`;

    logger.log(`Starting backup: ${backupFilePath}`);
    await new Promise<void>((resolve, reject) => {
      childProcess.exec(
        dumpCommand,
        { env: { ...process.env, PGPASSWORD: environment.DATABASE_PASSWORD } },
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

    await rotateBackups();
  } catch (error) {
    logger.error('Error during backup:', error);
  } finally {
    isBackingUp = false;
  }
}

// Function to rotate backups
async function rotateBackups(): Promise<void> {
  try {
    const files: string[] = (await fs.readdir(environment.BACKUP_DIR)).filter(
      (file) => file.endsWith(environment.BACKUP_COMPRESS ? '.sql.gz' : '.sql'),
    );

    const filesWithStats = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(environment.BACKUP_DIR, file);
        const stats = await fs.stat(filePath);
        return { file, mtime: stats.mtime.getTime() };
      }),
    );

    filesWithStats.sort((a, b) => a.mtime - b.mtime);

    if (filesWithStats.length > environment.BACKUP_ROTATION) {
      const filesToDelete = filesWithStats.slice(
        0,
        filesWithStats.length - environment.BACKUP_ROTATION,
      );
      for (const { file } of filesToDelete) {
        const filePath = path.join(environment.BACKUP_DIR, file);
        await fs.unlink(filePath);
        logger.log(`Deleted old backup: ${filePath}`);
      }
    }
  } catch (error) {
    logger.error('Error during backup rotation:', error);
  }
}

// Initial backup on script start
async function initializeBackup(): Promise<void> {
  try {
    await ensureBackupDirectoryExists();
    await createBackup();
  } catch (error) {
    logger.error('Error during initial backup:', error);
    throw error;
  }
}

// Schedule backups at the specified interval
function scheduleBackups(): void {
  setInterval(createBackup, environment.BACKUP_INTERVAL);
}

// Main function
async function main(): Promise<void> {
  await initializeBackup();
  scheduleBackups();
}

main().catch((error) => {
  logger.error('Fatal error in backup script:', error);
  throw error;
});
