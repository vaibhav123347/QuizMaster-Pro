import { connectDatabase, disconnectDatabase } from '../config/db';
import { env } from '../config/env';
import { ensureAdminAccount } from '../services/adminInitService';

const run = async (): Promise<void> => {
  try {
    if (!env.adminEmail || !env.adminPassword) {
      throw new Error(
        'Please set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env before running init-admin.'
      );
    }

    await connectDatabase();
    const created = await ensureAdminAccount();
    console.log(
      created
        ? 'Admin account initialized successfully.'
        : 'Admin account already exists and is verified.'
    );
  } catch (error) {
    console.error(
      '[init-admin] Failed:',
      error instanceof Error ? error.message : error
    );
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
};

void run();
