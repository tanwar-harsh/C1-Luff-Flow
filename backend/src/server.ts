import { createApp } from './app';
import { env } from './config/env';
import { disconnectPrisma } from './config/prisma';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
  console.log(`Health check: http://localhost:${env.PORT}/api/health`);
});

async function shutdown(signal: string): Promise<void> {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    await disconnectPrisma();
    process.exit(0);
  });
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
