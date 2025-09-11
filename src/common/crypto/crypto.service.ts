import * as crypto from 'node:crypto';
import { promisify } from 'node:util';

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export enum RandomStringPrefix {
  ACCESS_TOKEN = 'at_',
}

@Injectable()
export class CryptoService {
  private readonly SALT_ROUNDS: number;

  constructor() {
    this.SALT_ROUNDS = 11;
  }

  public async hash(data: string, salt: string): Promise<string> {
    return bcrypt.hash(data + salt, this.SALT_ROUNDS);
  }

  public async hashVerify(
    data: string,
    salt: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(data + salt, hash);
  }

  public async generateRandomString(
    prefix: RandomStringPrefix,
    length = 48,
    lengthIncludePrefix = true,
  ): Promise<string> {
    const BYTES_PER_CHAR = 2;
    const lengthInBytes = Math.ceil(length / BYTES_PER_CHAR); // Ensure we get enough bytes for the string length
    const randomBytes = promisify(crypto.randomBytes);

    const buffer = await randomBytes(lengthInBytes);
    const randomString = buffer.toString('hex');

    // Calculate the correct string length considering the prefix
    const result = prefix + randomString;
    return lengthIncludePrefix ? result.slice(0, length) : result;
  }
}
