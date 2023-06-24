import { execSync } from 'node:child_process';

import { Injectable } from '@nestjs/common';

import { Logger } from '@/common/logger/logger';

interface CommitInfo {
  name: string;
  hash: string;
}

@Injectable()
export class GitService {
  private readonly logger = new Logger(GitService.name);

  isGitInstalled(): boolean {
    try {
      execSync('git --version');
      return true;
    } catch {
      this.logger.error('Git is not installed. Returning empty commit info.');
      return false;
    }
  }

  isGitRepo(): boolean {
    if (!this.isGitInstalled()) return false;

    try {
      execSync('git rev-parse --is-inside-work-tree');
      return true;
    } catch {
      this.logger.error('Current directory is not a git repository.');
      return false;
    }
  }

  getLastCommitInfo(): CommitInfo {
    if (!this.isGitRepo()) return { name: '', hash: '' };

    const commitInfo: CommitInfo = {
      name: '',
      hash: '',
    };

    try {
      commitInfo.name = execSync('git log -1 --pretty=format:%s')
        .toString()
        .trim();

      commitInfo.hash = execSync('git rev-parse HEAD').toString().trim();
    } catch (error) {
      this.logger.error(
        'Error getting last commit info. Returning empty commit info.',
        error,
      );
    }

    return commitInfo;
  }
}
