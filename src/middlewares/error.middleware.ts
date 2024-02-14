import { ErrorHandler } from 'hono';
import { ZodError } from 'zod';

import { HttpStatus } from '@/utils/api.util';
import { ApiError, ApiErrorCode, ApiException } from '@/utils/error.util';
import { translate, TranslationKey } from '@/utils/translation.util';

type ResolveError = (err: any, locale: string | undefined) => { apiError: ApiError; httpStatus: HttpStatus };
const resolveError: ResolveError = (err, locale) => {
	switch (true) {
		case err instanceof ApiException:
			return {
				apiError: {
					code: err.code,
					isReadableMessage: err.isReadableMessage,
					message: err.isReadableMessage ? translate(err.message as TranslationKey, locale) : err.message,
					...(err.data !== undefined && { data: err.data }),
				},
				httpStatus: err.status,
			};
		case err instanceof ZodError:
			return {
				apiError: {
					code: ApiErrorCode.BAD_REQUEST,
					message: 'Bad request',
					isReadableMessage: false,
					data: {
						validationIssues: err.issues,
					},
				},
				httpStatus: HttpStatus.BAD_REQUEST,
			};
		case err instanceof Error:
			return {
				apiError: {
					code: ApiErrorCode.INTERNAL_ERROR,
					message: err.message,
					isReadableMessage: false,
				},
				httpStatus: HttpStatus.INTERNAL_ERROR,
			};
		default:
			return {
				apiError: {
					code: ApiErrorCode.INTERNAL_ERROR,
					message: 'Internal Server Error',
					isReadableMessage: false,
				},
				httpStatus: HttpStatus.INTERNAL_ERROR,
			};
	}
};

export const errorHandler: ErrorHandler = (err, c) => {
	const { apiError, httpStatus } = resolveError(err, c.req.header('Accept-Language'));
	return c.json({ success: false, error: apiError }, httpStatus);
};
