import {
	Column,
	Entity,
	Generated,
	Index,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryColumn,
	Relation,
	DeleteDateColumn,
} from '@aura/typeorm';
import type { SimpleColumnType } from '@aura/typeorm/driver/types/ColumnTypes';
import { ExecutionStatus, WorkflowExecuteMode } from 'aura-workflow';

import { DateTimeColumn, datetimeColumnType } from './abstract-entity';
import type { ExecutionAnnotation } from './execution-annotation.ee';
import type { ExecutionData } from './execution-data';
import type { ExecutionMetadata } from './execution-metadata';
import { WorkflowEntity } from './workflow-entity';
import { idStringifier } from '../utils/transformers';

@Entity()
@Index(['workflowId', 'id'])
@Index(['waitTill', 'id'])
@Index(['finished', 'id'])
@Index(['workflowId', 'finished', 'id'])
@Index(['workflowId', 'waitTill', 'id'])
export class ExecutionEntity {
	@Generated()
	@PrimaryColumn({ transformer: idStringifier })
	id: string;

	/**
	 * Whether the execution finished sucessfully.
	 *
	 * @deprecated Use `status` instead
	 */
	@Column()
	finished: boolean;

	@Column('varchar')
	mode: WorkflowExecuteMode;

	@Column({ nullable: true })
	retryOf: string;

	@Column({ nullable: true })
	retrySuccessId: string;

	@Column('varchar')
	status: ExecutionStatus;

	@Column(datetimeColumnType)
	createdAt: Date;

	/**
	 * Time when the processing of the execution actually started. This column
	 * is `null` when an execution is enqueued but has not started yet.
	 */
	@Column({
		type: datetimeColumnType as SimpleColumnType,
		nullable: true,
	})
	startedAt: Date | null;

	@Index()
	@DateTimeColumn({ nullable: true })
	stoppedAt: Date;

	@DeleteDateColumn({ type: datetimeColumnType as SimpleColumnType, nullable: true })
	deletedAt: Date;

	@Column({ nullable: true })
	workflowId: string;

	@DateTimeColumn({ nullable: true })
	waitTill: Date | null;

	@OneToMany('ExecutionMetadata', 'execution')
	metadata: ExecutionMetadata[];

	@OneToOne('ExecutionData', 'execution')
	executionData: Relation<ExecutionData>;

	@OneToOne('ExecutionAnnotation', 'execution')
	annotation?: Relation<ExecutionAnnotation>;

	@ManyToOne('WorkflowEntity')
	workflow: WorkflowEntity;
}
