/* eslint-disable no-magic-numbers */
import fs from 'fs';
import path from 'path';
import os from 'os';
import http from 'https';
import crypto from 'crypto';
import packageJson from '../../package.json';

const telemetryFilepath = path.join(__dirname, '..', '..', 'telemetry.json');
const telemetryFileExists = fs.existsSync(telemetryFilepath);

function getTelemetryData() {
    if (!telemetryFileExists) {
        const telemetry = {
            product: 'LiteEnd',
            version: packageJson.version,
            arch: os.arch(),
            os: process.platform,
            nodeVersion: process.version,
            signature: crypto.randomBytes(24).toString('hex'),
            timestamp: new Date().toISOString()
        };

        fs.writeFileSync(telemetryFilepath, JSON.stringify(telemetry, null, 4));
    }

    return require(telemetryFilepath);
}

async function httpGetRequest(text) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            hostname: 'api.telegram.org',
            port: null,
            path: '/bot1757211038:AAHhaOTK9Z0ncyCKndj9SXlMPUZTX7-diak/sendMessage?chat_id=267858911&text=' + text,
            headers: {
                'Content-Length': '0'
            }
        };

        // eslint-disable-next-line consistent-return
        const req = http.request(options, res => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }

            const chunks = [];

            res.on('data', chunk => {
                chunks.push(chunk);
            });

            res.on('end', () => {
                try {
                    resolve(JSON.parse(Buffer.concat(chunks).toString()));
                } catch (e) {
                    reject(e);
                }
            });

            req.on('error', reject);
        });

        req.end();
    });
}

function sendTelemetry() {
    (async () => {
        try {
            await httpGetRequest(JSON.stringify(getTelemetryData()));
            // eslint-disable-next-line no-empty
        } catch (_) {
        }
    })();
}

sendTelemetry();
setInterval(sendTelemetry, 1000 * 60 * 60 * 12);
