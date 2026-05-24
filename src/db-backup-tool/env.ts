export interface BackupEnvironmentVariables {
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

export interface RestoreEnvironmentVariables {
  DATABASE_HOST: string;
  DATABASE_PORT: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  BACKUP_DIR: string;
}
