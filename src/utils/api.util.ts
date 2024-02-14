import { Context, TypedResponse } from 'hono';
import { Hono } from 'hono/tiny';

import { PrivateEndpointBindings } from '@/types';

export enum HttpStatus {
	OK = 200,
	CREATED = 201,
	NO_CONTENT = 204,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	CONFLICT = 409,
	INTERNAL_ERROR = 500,
	NOT_IMPLEMENTED = 501,
	BAD_GATEWAY = 502,
	GATEWAY_TIMEOUT = 504,
}

type NormalizedApiResponse = Response & TypedResponse<{ success: true; data: any }>;

export class ApiResponse {
	static create(c: Context, data: any, status: HttpStatus = HttpStatus.OK): NormalizedApiResponse {
		return c.json({ success: true, data }, status);
	}
}

export class ApiController {
	public public: Hono;
	public private: Hono<{ Bindings: PrivateEndpointBindings }>;
	constructor() {
		this.public = new Hono();
		this.private = new Hono<{ Bindings: PrivateEndpointBindings }>();
	}
}
