import { Logger } from '@aura/backend-common';
import { CronLoggingConfig } from '@aura/config';
import { Time } from '@aura/constants';
import { Service } from '@aura/di';
import { CronJob } from 'cron';
import type { Cron, Workflow } from 'aura-workflow';

import { InstanceSettings } from '@/instance-settings';

@Service()
export class ScheduledTaskManager {
	readonly cronMap = new Map<string, Array<{ job: CronJob; displayableCron: string }>>();

	private readonly logInterval?: NodeJS.Timeout;

	constructor(
		private readonly instanceSettings: InstanceSettings,
		private readonly logger: Logger,
		private readonly config: CronLoggingConfig,
	) {
		this.logger = this.logger.scoped('cron');

		if (this.config.activeInterval === 0) return;

		this.logInterval = setInterval(
			() => this.logActiveCrons(),
			this.config.activeInterval * Time.minutes.toMilliseconds,
		);
	}

	private logActiveCrons() {
		const activeCrons: Record<string, string[]> = {};
		for (const [workflowId, cronJobs] of this.cronMap) {
			activeCrons[`workflow-${workflowId}`] = cronJobs.map(
				({ displayableCron }) => displayableCron,
			);
		}

		if (Object.keys(activeCrons).length === 0) return;

		this.logger.debug('Currently active crons', { activeCrons });
	}

	registerCron(workflow: Workflow, { expression, recurrence }: Cron, onTick: () => void) {
		const recurrenceStr = recurrence?.activated
			? `every ${recurrence.intervalSize} ${recurrence.typeInterval}`
			: undefined;

		const displayableCron = recurrenceStr ? `${expression} (${recurrenceStr})` : expression;

		const cronJob = new CronJob(
			expression,
			() => {
				if (this.instanceSettings.isLeader) {
					this.logger.debug('Executing cron for workflow', {
						workflowId: workflow.id,
						cron: displayableCron,
						instanceRole: this.instanceSettings.instanceRole,
					});
					onTick();
				}
			},
			undefined,
			true,
			workflow.timezone,
		);

		const workflowCronEntries = this.cronMap.get(workflow.id);
		const cronEntry = { job: cronJob, displayableCron };

		if (workflowCronEntries) {
			workflowCronEntries.push(cronEntry);
		} else {
			this.cronMap.set(workflow.id, [cronEntry]);
		}

		this.logger.debug('Registered cron for workflow', {
			workflowId: workflow.id,
			cron: displayableCron,
			instanceRole: this.instanceSettings.instanceRole,
		});
	}

	deregisterCrons(workflowId: string) {
		const cronJobs = this.cronMap.get(workflowId) ?? [];

		if (cronJobs.length === 0) return;

		const crons: string[] = [];

		while (cronJobs.length) {
			const cronEntry = cronJobs.pop();
			if (cronEntry) {
				crons.push(cronEntry.displayableCron);
				cronEntry.job.stop();
			}
		}

		this.cronMap.delete(workflowId);

		this.logger.info('Deregistered all crons for workflow', {
			workflowId,
			crons,
			instanceRole: this.instanceSettings.instanceRole,
		});
	}

	deregisterAllCrons() {
		for (const workflowId of this.cronMap.keys()) {
			this.deregisterCrons(workflowId);
		}

		if (this.logInterval) clearInterval(this.logInterval);
	}
}
