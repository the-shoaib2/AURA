import type { Workflow } from '@/aura-api-client/aura-api-client.types';

import type { AuthenticatedauraApiClient } from './authenticatedaurara-api-client';

export class WorkflowApiClient {
	constructor(private readonly apiClient: AuthenticatedauraApiClient) {}

	async getAllWorkflows(): Promise<Workflow[]> {
		const response = await this.apiClient.get<{ count: number; data: Workflow[] }>('/workflows');

		return response.data.data;
	}

	async createWorkflow(workflow: unknown): Promise<Workflow> {
		const response = await this.apiClient.post<{ data: Workflow }>('/workflows', workflow);

		return response.data.data;
	}

	async activateWorkflow(workflow: Workflow): Promise<Workflow> {
		const response = await this.apiClient.patch<{ data: Workflow }>(`/workflows/${workflow.id}`, {
			...workflow,
			active: true,
		});

		return response.data.data;
	}

	async archiveWorkflow(workflowId: Workflow['id']): Promise<void> {
		await this.apiClient.post(`/workflows/${workflowId}/archive`, {});
	}

	async deleteWorkflow(workflowId: Workflow['id']): Promise<void> {
		await this.apiClient.delete(`/workflows/${workflowId}`);
	}
}
