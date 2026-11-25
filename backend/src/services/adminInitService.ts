import { env } from '../config/env';
import { User } from '../models/User';

export const ensureAdminAccount = async (): Promise<boolean> => {
  const email = env.adminEmail.trim().toLowerCase();
  const password = env.adminPassword.trim();

  if (!email || !password) {
    if (env.nodeEnv !== 'test') {
      console.warn(
        '[Admin Init] ADMIN_EMAIL or ADMIN_PASSWORD not configured; skipping automatic admin initialization.'
      );
    }
    return false;
  }

  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      existing.isActive = true;
      await existing.save();
      console.log(`[Admin Init] Upgraded existing user (${email}) to admin role.`);
    }
    return false;
  }

  await User.create({
    name: 'Platform Administrator',
    email,
    password,
    role: 'admin',
    department: 'Security & Administration',
    bio: 'QuizMaster Pro system administrator',
    isActive: true,
  });

  console.log(`[Admin Init] Initialized administrator account for ${email}.`);
  return true;
};
