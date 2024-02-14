import { LambdaContext } from 'hono/aws-lambda';

export type PublicEndpointBindings = {
	lambdaContext: LambdaContext;
};

export type PrivateEndpointBindings = PublicEndpointBindings & {
	authenticator: AuthenticatorContextPayload;
};

export type AuthenticatorContextPayload = {
	id: string;
	email: string;
};
