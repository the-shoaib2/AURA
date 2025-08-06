import { OperationalError } from 'aura-workflow';
import { RateLimitError } from 'openai';
import { OpenAIError } from 'openai/error';

const errorMap: Record<string, string> = {
	insufficient_quota:
		'Insufficient quota detected. <a href="https://docs.aura.io/integrations/builtin/app-nodesaurara-nodes-langchain.openai/common-issues/#insufficient-quota" target="_blank">Learn more</a> about resolving this issue',
	rate_limit_exceeded: 'OpenAI: Rate limit reached',
};

export function getCustomErrorMessage(errorCode: string): string | undefined {
	return errorMap[errorCode];
}

export function isOpenAiError(error: any): error is OpenAIError {
	return error instanceof OpenAIError;
}

export const openAiFailedAttemptHandler = (error: any) => {
	if (error instanceof RateLimitError) {
		// If the error is a rate limit error, we want to handle it differently
		// because OpenAI has multiple different rate limit errors
		const errorCode = error?.code;
		const errorMessage =
			getCustomErrorMessage(errorCode ?? 'rate_limit_exceeded') ?? errorMap.rate_limit_exceeded;
		throw new OperationalError(errorMessage, { cause: error });
	}
};
