/* eslint-disable sonarjs/os-command,unicorn/no-await-expression-member,security/detect-non-literal-fs-filename,unicorn/prefer-top-level-await,security/detect-child-process,no-magic-numbers */
import * as childProcess from 'node:child_process';
import * as fs from 'node:fs/promises';
import path from 'node:path';

import { Logger } from './logger';

const logger = new Logger({ name: 'Restore' });

// Environment variables with strict types
interface EnvironmentVariables {
  DATABASE_HOST: string;
  DATABASE_PORT: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  BACKUP_DIR: string;
}

const environment: EnvironmentVariables = {
  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
  DATABASE_PORT: process.env.DATABASE_PORT || '5432',
  DATABASE_USER: process.env.DATABASE_USER || 'postgres',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'postgres',
  DATABASE_NAME: process.env.DATABASE_NAME || 'postgres',
  BACKUP_DIR: process.env.BACKUP_DIR || './data/database_backups',
};

// safe log environment
const safeEnvironment: EnvironmentVariables = {
  ...environment,
  DATABASE_PASSWORD: '***',
};

logger.info('Environment variables:', safeEnvironment);

// Function to restore a backup
async function restoreBackup(backupFileName: string): Promise<void> {
  const backupFilePath: string = path.join(
    environment.BACKUP_DIR,
    backupFileName,
  );

  try {
    await fs.access(backupFilePath);
  } catch {
    logger.error(`Backup file not found: ${backupFilePath}`);
    throw new Error('Backup file not found');
  }

  const isCompressed: boolean = backupFileName.endsWith('.gz');

  // Команда для восстановления
  const restoreCommand: string = isCompressed
    ? `gunzip -c ${backupFilePath} | psql -h ${environment.DATABASE_HOST} -p ${environment.DATABASE_PORT} -U ${environment.DATABASE_USER} -d ${environment.DATABASE_NAME}`
    : `psql -h ${environment.DATABASE_HOST} -p ${environment.DATABASE_PORT} -U ${environment.DATABASE_USER} -d ${environment.DATABASE_NAME} -f ${backupFilePath}`;

  logger.info(`Starting restore from: ${backupFilePath}`);
  await new Promise<void>((resolve, reject) => {
    childProcess.exec(
      restoreCommand,
      { env: { ...process.env, PGPASSWORD: environment.DATABASE_PASSWORD } },
      (error) => {
        if (error) {
          logger.error('Restore failed:', error);
          reject(error);
        } else {
          logger.info('Restore completed successfully.');
          resolve();
        }
      },
    );
  });
}

// Main function
async function main(backupFileName: string): Promise<void> {
  try {
    await restoreBackup(backupFileName);
  } catch (error) {
    logger.error('Fatal error in restore script:', error);
    throw error;
  }
}

// Example usage: node restore.js backup_file_name.sql.gz
const backupFileName = process.argv[2];
if (!backupFileName) {
  logger.error('Please provide the backup file name as an argument.');
  throw new Error('Please provide the backup file name as an argument.');
}

main(backupFileName).catch((error) => {
  logger.error('Fatal error in restore script:', error);
  throw error;
});
