import {ChildProcess, spawn} from 'child_process';
import kill from 'tree-kill';
import {createProxyMiddleware} from 'http-proxy-middleware';
import {Express, RequestHandler} from 'express';

export class PrismaStudioService {
    private child: ChildProcess | undefined;

    public startStudio(): Promise<unknown> {
        console.log('Starting prisma studio...');
        return this.spawnProcess('npm run db:studio-local');
    }

    public stopStudio(): Promise<unknown> {
        console.log('Stopping prisma studio...');
        return this.killProcess();
    }

    public applyExpressMiddleware(urlPath: string, app: Express, authMiddleware: RequestHandler): void {
        const proxy = createProxyMiddleware({
            target: 'http://localhost:5555',
            changeOrigin: true,
            pathRewrite: {
                [`^${urlPath}`]: '/'
            }
        });

        app.use(urlPath, authMiddleware, proxy);
        // hard coded routes for prisma studio
        app.use('/api', authMiddleware, proxy);
        app.use('/http/databrowser.js', authMiddleware, proxy);
        app.use('/assets/index.js', authMiddleware, proxy);
        app.use('/assets/vendor.js', authMiddleware, proxy);
        app.use('/index.css', authMiddleware, proxy);
    }

    private spawnProcess(command: string): Promise<unknown> {
        return new Promise<void>((resolve, reject) => {
            this.child = spawn(command, {
                shell: true,
                stdio: 'inherit'
            });

            this.child.on('error', (error) => {
                console.error(error);
                reject(error);
            });

            this.child.on('exit', () => {
                resolve();
            });
        });
    }

    private killProcess(): Promise<unknown> {
        return new Promise<void>((resolve, reject) => {
            if (this.child?.pid) {
                kill(this.child.pid, 'SIGKILL', (error) => {
                    if (error) {
                        console.error(error);
                        reject(error);
                    }
                    resolve();
                });
            }
        });
    }
}
