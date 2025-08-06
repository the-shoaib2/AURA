import type {
	IExecuteFunctions,
	IHookFunctions,
	IDataObject,
	ILoadOptionsFunctions,
	JsonObject,
	IHttpRequestMethods,
	IRequestOptions,
} from 'aura-workflow';
import { NodeApiError } from 'aura-workflow';

/**
 * Make an authenticated API request to Raindrop.
 */
export async function raindropApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	qs: IDataObject,
	body: IDataObject,
	option: IDataObject = {},
) {
	const options: IRequestOptions = {
		headers: {
			'user-agent': 'aura',
			'Content-Type': 'application/json',
		},
		method,
		uri: `https://api.raindrop.io/rest/v1${endpoint}`,
		qs,
		body,
		json: true,
	};

	if (!Object.keys(body).length) {
		delete options.body;
	}

	if (!Object.keys(qs).length) {
		delete options.qs;
	}

	if (Object.keys(option).length !== 0) {
		Object.assign(options, option);
	}

	try {
		return await this.helpers.requestOAuth2.call(this, 'raindropOAuth2Api', options, {
			includeCredentialsOnRefreshOnBody: true,
		});
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
