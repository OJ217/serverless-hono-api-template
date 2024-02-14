import { handle } from 'hono/aws-lambda';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { logger } from 'hono/logger';
import { poweredBy } from 'hono/powered-by';
import { secureHeaders } from 'hono/secure-headers';
import { Hono } from 'hono/tiny';

import { errorHandler } from '@/middlewares/error.middleware';
import { setUpLambda } from '@/middlewares/lambda.middleware';
import { PublicEndpointBindings } from '@/types';
import { ApiResponse } from '@/utils/api.util';

const app = new Hono<{ Bindings: PublicEndpointBindings }>();

// ** Middleware
app.use('*', logger());
app.use('*', poweredBy());
app.use('*', secureHeaders());
app.use('*', compress({ encoding: 'gzip' }));
app.use('*', csrf({ origin: ['http://localhost:3000', 'https://music-lab-next.vercel.app', 'https://www.music-lab.app'] }));
app.use('*', cors({ credentials: true, origin: ['*'] }));
app.use('*', setUpLambda);

// ** Routes
app.get('/api', c => ApiResponse.create(c, 'API service private endpoints 🛠️ (Powered by Hono 🔥 x Serverless 🚀)'));

// ** Error handler
app.onError(errorHandler);

export const privateEndpointHandler = handle(app);
