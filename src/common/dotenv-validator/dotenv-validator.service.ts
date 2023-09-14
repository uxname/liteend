import * as fs from 'node:fs';

import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

@Injectable()
export class DotenvValidatorService {
  constructor() {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    const environmentFilePath = '.env';
    const environmentExampleFilePath = '.env.example';

    const environmentContent = fs.readFileSync(environmentFilePath, 'utf8');
    const environmentConfig = dotenv.parse(environmentContent);

    const environmentExampleContent = fs.readFileSync(
      environmentExampleFilePath,
      'utf8',
    );
    const environmentExampleConfig = dotenv.parse(environmentExampleContent);

    for (const key in environmentExampleConfig) {
      if (!environmentConfig.hasOwnProperty(key)) {
        throw new Error(
          `Environment variable "${key}" exists in ${environmentExampleFilePath} but not in ${environmentFilePath}`,
        );
      }
    }

    for (const key in environmentConfig) {
      if (!environmentExampleConfig.hasOwnProperty(key)) {
        throw new Error(
          `Environment variable "${key}" exists in ${environmentFilePath} but not in ${environmentExampleFilePath}`,
        );
      }
    }
  }
}
