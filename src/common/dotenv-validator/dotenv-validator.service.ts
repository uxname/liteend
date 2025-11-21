import * as fs from 'node:fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DotenvValidatorService {
  constructor() {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    const environmentFilePath = '.env';
    const environmentExampleFilePath = '.env.example';

    const environmentContent = fs.readFileSync(environmentFilePath, 'utf8');
    const environmentKeys = this.parseKeys(environmentContent);

    const environmentExampleContent = fs.readFileSync(
      environmentExampleFilePath,
      'utf8',
    );
    const environmentExampleKeys = this.parseKeys(environmentExampleContent);

    for (const key of environmentExampleKeys) {
      if (!environmentKeys.includes(key)) {
        throw new Error(
          `Environment variable "${key}" exists in ${environmentExampleFilePath} but not in ${environmentFilePath}`,
        );
      }
    }

    for (const key of environmentKeys) {
      if (!environmentExampleKeys.includes(key)) {
        throw new Error(
          `Environment variable "${key}" exists in ${environmentFilePath} but not in ${environmentExampleFilePath}`,
        );
      }
    }
  }

  /**
   * Simple parser to extract keys from env file content
   * Ignores comments (#) and empty lines
   */
  private parseKeys(content: string): string[] {
    return content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith('#'))
      .map((line) => {
        const separatorIndex = line.indexOf('=');
        if (separatorIndex === -1) return line;
        return line.substring(0, separatorIndex).trim();
      });
  }
}
