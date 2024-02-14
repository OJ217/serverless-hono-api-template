import { Env, MiddlewareHandler, ValidationTargets } from 'hono';
import { validator } from 'hono/validator';
import { z, ZodSchema } from 'zod';

type HasUndefined<T> = undefined extends T ? true : false;

export const schemaValidator = <
	T extends ZodSchema,
	Target extends keyof ValidationTargets,
	E extends Env,
	P extends string,
	I = z.input<T>,
	O = z.output<T>,
	V extends {
		in: HasUndefined<I> extends true ? { [K in Target]?: I } : { [K in Target]: I };
		out: { [K in Target]: O };
	} = {
		in: HasUndefined<I> extends true ? { [K in Target]?: I } : { [K in Target]: I };
		out: { [K in Target]: O };
	}
>(
	target: Target,
	schema: T
): MiddlewareHandler<E, P, V> =>
	validator(target, async value => {
		const result = await schema.safeParseAsync(value);

		if (!result.success) {
			throw result.error;
		}

		const data = result.data;
		return data;
	});
