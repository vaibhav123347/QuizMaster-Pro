import app from './app';
import { connectDatabase, disconnectDatabase } from './config/db';
import { env, validateRuntimeEnv } from './config/env';
import { ensureAdminAccount } from './services/adminInitService';
import { runSeed } from './scripts/seed';

const startServer = async (): Promise<void> => {
  try {
    validateRuntimeEnv();
    await connectDatabase();
    console.log('[MongoDB] Connected to database successfully.');

    await ensureAdminAccount();
    await runSeed();

    const server = app.listen(env.port, () => {
      console.log(
        `[Server] QuizMaster Pro API running in ${env.nodeEnv} mode on port ${env.port}`
      );
    });

    const shutdown = async (signal: string): Promise<void> => {
      console.log(`[Server] Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => void shutdown('SIGTERM'));
    process.on('SIGINT', () => void shutdown('SIGINT'));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown startup error';
    console.error('[Startup Error]', message);
    process.exit(1);
  }
};

void startServer();
