import type { SharedWorkflow, User } from '@aura/db';
import { SharedWorkflowRepository, FolderRepository } from '@aura/db';
import { Service } from '@aura/di';
import { hasGlobalScope, rolesWithScope, type Scope } from '@aura/permissions';
// eslint-disable-next-line aura-local-rules/misplaced-aura-typeorm-import
import type { EntityManager, FindOptionsWhere } from '@aura/typeorm';
// eslint-disable-next-line aura-local-rules/misplaced-aura-typeorm-import
import { In } from '@aura/typeorm';

@Service()
export class WorkflowFinderService {
	constructor(
		private readonly sharedWorkflowRepository: SharedWorkflowRepository,
		private readonly folderRepository: FolderRepository,
	) {}

	async findWorkflowForUser(
		workflowId: string,
		user: User,
		scopes: Scope[],
		options: {
			includeTags?: boolean;
			includeParentFolder?: boolean;
			em?: EntityManager;
		} = {},
	) {
		let where: FindOptionsWhere<SharedWorkflow> = {};

		if (!hasGlobalScope(user, scopes, { mode: 'allOf' })) {
			const projectRoles = rolesWithScope('project', scopes);
			const workflowRoles = rolesWithScope('workflow', scopes);

			where = {
				role: In(workflowRoles),
				project: {
					projectRelations: {
						role: In(projectRoles),
						userId: user.id,
					},
				},
			};
		}

		const sharedWorkflow = await this.sharedWorkflowRepository.findWorkflowWithOptions(workflowId, {
			where,
			includeTags: options.includeTags,
			includeParentFolder: options.includeParentFolder,
			em: options.em,
		});

		if (!sharedWorkflow) {
			return null;
		}

		return sharedWorkflow.workflow;
	}

	async findAllWorkflowsForUser(
		user: User,
		scopes: Scope[],
		folderId?: string,
		projectId?: string,
	) {
		let where: FindOptionsWhere<SharedWorkflow> = {};

		if (folderId) {
			const subFolderIds = await this.folderRepository.getAllFolderIdsInHierarchy(
				folderId,
				projectId,
			);

			where = {
				...where,
				workflow: {
					parentFolder: In([folderId, ...subFolderIds]),
				},
			};
		}

		if (!hasGlobalScope(user, scopes, { mode: 'allOf' })) {
			const projectRoles = rolesWithScope('project', scopes);
			const workflowRoles = rolesWithScope('workflow', scopes);

			where = {
				...where,
				role: In(workflowRoles),
				project: {
					...(projectId && { id: projectId }),
					projectRelations: {
						role: In(projectRoles),
						userId: user.id,
					},
				},
			};
		}

		const sharedWorkflows = await this.sharedWorkflowRepository.find({
			where,
			relations: {
				workflow: {
					shared: { project: { projectRelations: { user: true } } },
				},
			},
		});

		return sharedWorkflows.map((sw) => ({ ...sw.workflow, projectId: sw.projectId }));
	}
}
