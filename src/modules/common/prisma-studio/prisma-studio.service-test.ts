import {PrismaStudioService} from './prisma-studio.service';

async function main() {
    const prismaStudioService = new PrismaStudioService();
    // noinspection ES6MissingAwait
    prismaStudioService.startStudio();

    // sleep 3000 ms
    await new Promise(resolve => setTimeout(resolve, 10000));

    await prismaStudioService.stopStudio();
}

main().catch(console.error);
