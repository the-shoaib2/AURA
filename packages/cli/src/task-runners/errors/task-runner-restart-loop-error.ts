import { UnexpectedError } from 'aura-workflow';

export class TaskRunnerRestartLoopError extends UnexpectedError {
	constructor(
		readonly howManyTimes: number,
		readonly timePeriodMs: number,
	) {
		const message = `Task runner has restarted ${howManyTimes} times within ${timePeriodMs / 1000} seconds. This is an abnormally high restart rate that suggests a bug or other issue is preventing your runner process from starting up. If this issues persists, please file a report at: https://github.com/the-shoaib2/aura/issues`;

		super(message);
	}
}
