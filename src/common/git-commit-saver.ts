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

// Check if Git is installed
function isGitInstalled(): boolean {
  try {
    execSync('git --version');
    return true;
  } catch {
    console.error('Git is not installed.');
    return false;
  }
}

// Check if the current directory is inside a Git repository
function isGitRepo(): boolean {
  if (!isGitInstalled()) return false;

  try {
    execSync('git rev-parse --is-inside-work-tree');
    return true;
  } catch {
    console.error('Not a Git repository.');
    return false;
  }
}

// Get the last commit info
function getLastCommitInfo(): CommitInfo {
  if (!isGitRepo()) return { name: 'NO_COMMIT_NAME', hash: 'NO_COMMIT_HASH' };

  try {
    const name = execSync('git log -1 --pretty=format:%s').toString().trim();
    const hash = execSync('git rev-parse HEAD').toString().trim();
    return { name, hash };
  } catch (error) {
    console.error('Error fetching commit info:', error);
    return { name: 'NO_COMMIT_NAME', hash: 'NO_COMMIT_HASH' };
  }
}

// Ensure the dist directory exists
function ensureDistributionFolderExists(): void {
  if (!existsSync(DIST_FOLDER_PATH)) {
    mkdirSync(DIST_FOLDER_PATH);
    console.log('Dist folder created at:', DIST_FOLDER_PATH);
  }
}

// Save the last commit info to a JSON file
function saveCommitInfo(): void {
  const lastCommitInfo = getLastCommitInfo();
  writeFileSync(LAST_COMMIT_INFO_FILE_PATH, JSON.stringify(lastCommitInfo));
  console.log('Last commit info saved to:', LAST_COMMIT_INFO_FILE_PATH);
}

// Main execution flow
ensureDistributionFolderExists();
saveCommitInfo();
