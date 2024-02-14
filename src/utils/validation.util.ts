import { z } from 'zod';

export const nonEmptyObjectSchema = (schema: z.Schema, errorMessage: string = 'At least one key must be provided') =>
	z.lazy(() =>
		schema.refine(
			val => {
				const keys = Object.keys(val);
				return keys.length >= 1;
			},
			{ message: errorMessage }
		)
	);

export const paginationSchema = z.object({
	page: z.string().pipe(z.coerce.number().int().min(1)).optional().default('1'),
	limit: z.string().pipe(z.coerce.number().int().min(1).max(20)).optional().default('10'),
});
