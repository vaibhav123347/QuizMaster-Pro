import { Request, Response } from 'express';
import { Category } from '../models/Category';
import { Quiz } from '../models/Quiz';
import { AppError } from '../utils/AppError';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { toSlug } from '../utils/sanitize';

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const includeInactive =
    req.user?.role === 'admin' && req.query.includeInactive === 'true';

  const filter = includeInactive ? {} : { isActive: true };
  const categories = await Category.find(filter).sort({ name: 1 }).lean();

  const quizFilter = includeInactive ? {} : { isActive: true };
  const quizCounts = await Quiz.aggregate<{ _id: string; quizCount: number }>([
    { $match: quizFilter },
    { $group: { _id: '$category', quizCount: { $sum: 1 } } },
  ]);

  const countMap = new Map(quizCounts.map((c) => [c._id.toString(), c.quizCount]));

  const enriched = categories.map((cat) => ({
    ...cat,
    quizCount: countMap.get(cat._id.toString()) ?? 0,
  }));

  sendSuccess(res, 200, 'Categories fetched successfully', { categories: enriched });
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  const category = await Category.findOne(isObjectId ? { _id: id } : { slug: id });

  if (!category) {
    throw new AppError('Category not found.', 404, 'CATEGORY_NOT_FOUND');
  }

  sendSuccess(res, 200, 'Category fetched successfully', { category });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, icon, color, isActive } = req.body;
  const slug = toSlug(name);

  const existing = await Category.findOne({ $or: [{ name }, { slug }] });
  if (existing) {
    throw new AppError(
      'A category with this name already exists.',
      409,
      'DUPLICATE_CATEGORY'
    );
  }

  const category = await Category.create({
    name,
    slug,
    description,
    icon,
    color,
    isActive,
  });

  sendSuccess(res, 201, 'Category created successfully', { category });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError('Category not found.', 404, 'CATEGORY_NOT_FOUND');
  }

  const { name, description, icon, color, isActive } = req.body;

  if (name && name !== category.name) {
    const newSlug = toSlug(name);
    const duplicate = await Category.findOne({
      _id: { $ne: id },
      $or: [{ name }, { slug: newSlug }],
    });
    if (duplicate) {
      throw new AppError(
        'Another category with this name already exists.',
        409,
        'DUPLICATE_CATEGORY'
      );
    }
    category.name = name;
    category.slug = newSlug;
  }

  if (description !== undefined) category.description = description;
  if (icon !== undefined) category.icon = icon;
  if (color !== undefined) category.color = color;
  if (isActive !== undefined) category.isActive = isActive;

  await category.save();
  sendSuccess(res, 200, 'Category updated successfully', { category });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError('Category not found.', 404, 'CATEGORY_NOT_FOUND');
  }

  const linkedQuizzes = await Quiz.countDocuments({ category: id });
  if (linkedQuizzes > 0) {
    throw new AppError(
      `Cannot delete category while ${linkedQuizzes} quiz(zes) are assigned to it. Delete or reassign those quizzes first.`,
      409,
      'CATEGORY_IN_USE'
    );
  }

  await category.deleteOne();
  sendSuccess(res, 200, 'Category deleted successfully', null);
});
