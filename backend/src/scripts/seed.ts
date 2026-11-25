import { connectDatabase, disconnectDatabase } from '../config/db';
import { Category } from '../models/Category';
import { Question } from '../models/Question';
import { Quiz } from '../models/Quiz';
import { ensureAdminAccount } from '../services/adminInitService';
import { syncQuizMetadata } from '../services/quizStatsService';
import { SEED_BUNDLES } from './seedData';

export const runSeed = async (): Promise<{
  categoriesUpserted: number;
  quizzesUpserted: number;
  questionsUpserted: number;
}> => {
  await ensureAdminAccount();

  let categoriesUpserted = 0;
  let quizzesUpserted = 0;
  let questionsUpserted = 0;

  for (const bundle of SEED_BUNDLES) {
    const category = await Category.findOneAndUpdate(
      { slug: bundle.category.slug },
      {
        $set: {
          name: bundle.category.name,
          slug: bundle.category.slug,
          description: bundle.category.description,
          icon: bundle.category.icon,
          color: bundle.category.color,
          isActive: true,
        },
      },
      { upsert: true, new: true, runValidators: true }
    );
    categoriesUpserted += 1;

    const quiz = await Quiz.findOneAndUpdate(
      { slug: bundle.quiz.slug },
      {
        $set: {
          title: bundle.quiz.title,
          slug: bundle.quiz.slug,
          description: bundle.quiz.description,
          category: category._id,
          difficulty: bundle.quiz.difficulty,
          durationMinutes: bundle.quiz.durationMinutes,
          passingPercentage: bundle.quiz.passingPercentage,
          isActive: true,
        },
      },
      { upsert: true, new: true, runValidators: true }
    );
    quizzesUpserted += 1;

    for (let idx = 0; idx < bundle.questions.length; idx += 1) {
      const q = bundle.questions[idx];
      await Question.findOneAndUpdate(
        { quiz: quiz._id, text: q.text },
        {
          $set: {
            quiz: quiz._id,
            category: category._id,
            text: q.text,
            options: q.options,
            correctOptionIndex: q.correctOptionIndex,
            explanation: q.explanation,
            difficulty: q.difficulty,
            marks: q.marks,
            order: idx + 1,
            isActive: true,
          },
        },
        { upsert: true, new: true, runValidators: true }
      );
      questionsUpserted += 1;
    }

    await syncQuizMetadata(quiz._id);
  }

  return {
    categoriesUpserted,
    quizzesUpserted,
    questionsUpserted,
  };
};

const executeCliSeed = async (): Promise<void> => {
  try {
    await connectDatabase();
    const summary = await runSeed();
    console.log('[Seed] Completed idempotent seed:', summary);
  } catch (error) {
    console.error('[Seed] Failed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
};

if (require.main === module) {
  void executeCliSeed();
}
