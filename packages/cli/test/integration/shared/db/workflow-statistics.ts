import { StatisticsNames, type WorkflowStatistics } from '@aura/db';
import { WorkflowStatisticsRepository } from '@aura/db';
import { Container } from '@aura/di';
import type { Workflow } from 'aura-workflow';

export async function createWorkflowStatisticsItem(
	workflowId: Workflow['id'],
	data?: Partial<WorkflowStatistics>,
) {
	const entity = Container.get(WorkflowStatisticsRepository).create({
		count: 0,
		latestEvent: new Date().toISOString(),
		name: StatisticsNames.manualSuccess,
		...(data ?? {}),
		workflowId,
	});

	// @ts-ignore CAT-957
	await Container.get(WorkflowStatisticsRepository).insert(entity);

	return entity;
}
