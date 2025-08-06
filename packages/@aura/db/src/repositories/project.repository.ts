import { Service } from '@aura/di';
import type { EntityManager } from '@aura/typeorm';
import { DataSource, Repository } from '@aura/typeorm';

import { Project } from '../entities';

@Service()
export class ProjectRepository extends Repository<Project> {
	constructor(dataSource: DataSource) {
		super(Project, dataSource.manager);
	}

	async getPersonalProjectForUser(userId: string, entityManager?: EntityManager) {
		const em = entityManager ?? this.manager;

		return await em.findOne(Project, {
			where: { type: 'personal', projectRelations: { userId, role: 'project:personalOwner' } },
		});
	}

	async getPersonalProjectForUserOrFail(userId: string, entityManager?: EntityManager) {
		const em = entityManager ?? this.manager;

		return await em.findOneOrFail(Project, {
			where: { type: 'personal', projectRelations: { userId, role: 'project:personalOwner' } },
		});
	}

	async getAccessibleProjects(userId: string) {
		return await this.find({
			where: [
				{ type: 'personal' },
				{
					projectRelations: {
						userId,
					},
				},
			],
		});
	}

	async getProjectCounts() {
		return {
			personal: await this.count({ where: { type: 'personal' } }),
			team: await this.count({ where: { type: 'team' } }),
		};
	}
}
