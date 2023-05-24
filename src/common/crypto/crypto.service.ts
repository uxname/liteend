import * as crypto from 'node:crypto';

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export enum RandomStringType {
  ACCESS_TOKEN = 'at_',
}

@Injectable()
export class CryptoService {
  public async hash(data: string, salt: string): Promise<string> {
    const SALT_ROUNDS = 11;
    return bcrypt.hash(data + salt, SALT_ROUNDS);
  }

  public async hashVerify(
    data: string,
    salt: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(data + salt, hash);
  }

  public async generateRandomString(
    prefix: RandomStringType,
    // eslint-disable-next-line no-magic-numbers
    length = 48,
    lengthIncludePrefix = true,
  ): Promise<string> {
    const BYTES_PER_CHAR = 2;
    const lengthInBytes = length / BYTES_PER_CHAR;
    return new Promise((resolve, reject) => {
      crypto.randomBytes(lengthInBytes, (error, buffer) => {
        if (error) {
          reject(error);
        } else if (lengthIncludePrefix) {
          const result = prefix + buffer.toString('hex');
          resolve(result.slice(0, length));
        } else {
          resolve(prefix + buffer.toString('hex'));
        }
      });
    });
  }
}
