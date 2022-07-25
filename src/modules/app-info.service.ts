export class AppInfoService {
    static getAppInfo() {
        return {
            appName: 'LiteEnd',
            appVersion: '1.0.0',
            serverTime: new Date().toISOString(),
            uptimeSeconds: process.uptime()
        };
    }
}
