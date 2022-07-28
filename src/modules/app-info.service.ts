import {execSync} from 'child_process';

export class AppInfoService {
    static getAppInfo() {
        return {
            appName: 'LiteEnd',
            appVersion: '1.0.0',
            serverTime: new Date().toISOString(),
            uptimeSeconds: process.uptime()
        };
    }

    static getLastCommitMessageText() {
        return execSync('git log -1 --pretty=%B').toString().trim();
    }

    static getLastCommitHash() {
        return execSync('git rev-parse HEAD').toString().trim();
    }
}
