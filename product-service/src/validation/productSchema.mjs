import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  category: z.string().optional(),
  stock: z.coerce.number().int().min(0, 'Stock must be a positive integer').default(0),
  imageUrl: z.string().optional()
});

export const updateProductSchema = productSchema.partial();
