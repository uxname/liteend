import crypto from 'node:crypto';
import fs from 'node:fs';
import * as https from 'node:https';
import os from 'node:os';
import path from 'node:path';

import appInfo from '../../app-info.json';

const telemetryFilepath = path.join(process.cwd(), 'data', 'telemetry.json');
const telemetryFileExists = fs.existsSync(telemetryFilepath);

interface ITelemetry {
  Product: string;
  Version: string;
  Arch: string;
  OS: string;
  NodeJS: string;
  Signature: string;
  Launch: string;
}

const p = 'PaQHW7znR2BdPNJFMvk9UyQMqQ9J2quU';

function getTelemetryData(): ITelemetry {
  if (!telemetryFileExists) {
    const telemetry: ITelemetry = {
      Product: appInfo.name.toString(),
      Version: appInfo.version.toString(),
      Arch: os.arch().toString(),
      OS: process.platform.toString(),
      NodeJS: process.version.toString(),
      Signature: `#${crypto.randomBytes(6).toString('hex')}`,
      Launch: new Date().toISOString(),
    };

    fs.writeFileSync(
      telemetryFilepath,
      JSON.stringify(telemetry, undefined, 4),
    );
  }

  // eslint-disable-next-line unicorn/prefer-module,security/detect-non-literal-require
  const result: ITelemetry = require(telemetryFilepath);
  result.Launch = new Date().toISOString();
  fs.writeFileSync(telemetryFilepath, JSON.stringify(result, undefined, 4));
  return result;
}

async function sendMessage(m: string, c: number, t: string) {
  function urlEncode(url: string): string {
    return encodeURIComponent(url).replace(/'/g, '%27').replace(/"/g, '%22');
  }

  return new Promise((resolve, reject) => {
    const options = {
      hostname: decryptStringIv(
        '0ef2806ccce0d8e83e44b757d28cfa0c66fe48e53e8bea125da67b43e960e0c6696b5ef28c0455ac89b662bad2f91b49',
      ),
      port: 443,
      path: `/bot${t}/sendMessage?parse_mode=markdown&chat_id=${c}&text=${urlEncode(
        m,
      )}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const request = https.request(options, (res) => {
      res.on('data', (d) => {
        resolve(d);
      });
    });

    request.on('error', (e) => {
      reject(e);
    });

    request.end();
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// function encryptStringIv(text: string): string {
//   const iv = crypto.randomBytes(16);
//   const cipher = crypto.createCipheriv('aes-256-cbc', p, iv);
//   let encrypted = cipher.update(text, 'utf8', 'hex');
//   encrypted += cipher.final('hex');
//   return iv.toString('hex') + encrypted;
// }

function decryptStringIv(text: string): string {
  const iv = Buffer.from(text.slice(0, 32), 'hex');
  const encryptedText = text.slice(32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', p, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function sendStatistic() {
  if (process.env.DISABLE_TELEMETRY === 'true') {
    return;
  }

  // Format object like YAML
  function objectPrettify(obj: any): string {
    const result = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const element = obj[key];
        if (typeof element === 'object') {
          result.push(`${key}:`);
          result.push(objectPrettify(element).split(' \n').join(' \n '));
        } else {
          result.push(`${key}: *${element}*`);
        }
      }
    }
    return result.join(' \n');
  }

  async function send(prefix: string) {
    const msg = prefix + '\n' + objectPrettify(getTelemetryData());
    await sendMessage(
      msg,
      Number(
        decryptStringIv(
          '39429ee6bdabaa196bb969e1425faf9c8dba35d0bf1f7349f3ecb3672e8570f7',
        ),
      ),
      decryptStringIv(
        '62b682626243b8698ea42ac9649e322af8fc9ca36b5367a5db91a3e7e63f88c144b2e6dd011b22df4e2d75a70b7ae39fa326604800ec644e113365af076123c7',
      ),
    );
  }

  try {
    if (process.env.NODE_ENV === 'production') {
      send('#PRODUCTION').catch(() => {
      });
      setInterval(async () => {
        await send('#PRODUCTION_12H');
      }, 1000 * 60 * 60 * 12);
    } else {
      send('#DEVELOPMENT').catch(() => {
      });
    }
  } catch {
    //ignore
  }
}
