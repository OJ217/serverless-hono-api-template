import { MiddlewareHandler } from 'hono';
import { LambdaContext } from 'hono/aws-lambda';

// ** AWS Lambda Function Setup Middleware
export const setUpLambda: MiddlewareHandler<{
	Bindings: {
		lambdaContext: LambdaContext;
	};
}> = async (c, next) => {
	// ** Response Headers
	const { logStreamName, awsRequestId, invokedFunctionArn } = c.env.lambdaContext;
	c.header('x-amzn-cw-logstream', logStreamName);
	c.header('x-amzn-lambda-requestid', awsRequestId);
	c.header('x-amzn-lambda-arn', invokedFunctionArn);

	// ** Event Loop
	c.env.lambdaContext.callbackWaitsForEmptyEventLoop = false;

	await next();
};
