import { AURA_IO_BASE_URL } from '@aura/constants';

import { get, post } from '../utils';

export interface N8nPrompts {
	message?: string;
	title?: string;
	showContactPrompt?: boolean;
}

export interface N8nPromptResponse {
	updated: boolean;
}

export async function getPromptsData(instanceId: string, userId: string): Promise<N8nPrompts> {
	return await get(
		AURA_IO_BASE_URL,
		'/prompts',
		{},
		{ 'aura-instance-id': instanceId, 'aura-user-id': userId },
	);
}

export async function submitContactInfo(
	instanceId: string,
	userId: string,
	email: string,
): Promise<N8nPromptResponse> {
	return await post(
		AURA_IO_BASE_URL,
		'/prompt',
		{ email },
		{ 'aura-instance-id': instanceId, 'aura-user-id': userId },
	);
}
