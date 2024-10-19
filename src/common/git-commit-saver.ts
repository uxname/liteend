/* eslint-disable sonarjs/no-os-command-from-path */
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const DIST_FOLDER_PATH = path.resolve(process.cwd(), 'dist');

const LAST_COMMIT_INFO_FILE_PATH = path.resolve(
  DIST_FOLDER_PATH,
  'last-commit-info.json',
);

interface CommitInfo {
  name: string;
  hash: string;
}

function isGitInstalled(): boolean {
  try {
    execSync('git --version');
    return true;
  } catch {
    console.error('Git is not installed. Returning empty commit info.');
    return false;
  }
}

function isGitRepo(): boolean {
  if (!isGitInstalled()) return false;

  try {
    execSync('git rev-parse --is-inside-work-tree');
    return true;
  } catch {
    console.error('Current directory is not a git repository.');
    return false;
  }
}

function getLastCommitInfo(): CommitInfo {
  if (!isGitRepo()) return { name: '', hash: '' };

  const commitInfo: CommitInfo = {
    name: 'NO_COMMIT_NAME',
    hash: 'NO_COMMIT_HASH',
  };

  try {
    commitInfo.name = execSync('git log -1 --pretty=format:%s')
      .toString()
      .trim();

    commitInfo.hash = execSync('git rev-parse HEAD').toString().trim();
  } catch (error) {
    console.error(
      'Error getting last commit info. Returning empty commit info.',
      error,
    );
  }

  return commitInfo;
}

const lastCommitInfo = getLastCommitInfo();

// create dist folder if it doesn't exist
if (!existsSync(DIST_FOLDER_PATH)) {
  mkdirSync(DIST_FOLDER_PATH);
  console.log('\u001B[32m', 'Dist folder created at:', DIST_FOLDER_PATH);
}

writeFileSync(LAST_COMMIT_INFO_FILE_PATH, JSON.stringify(lastCommitInfo));
console.log(
  '\u001B[32m',
  'Last commit info saved to:',
  LAST_COMMIT_INFO_FILE_PATH,
);
