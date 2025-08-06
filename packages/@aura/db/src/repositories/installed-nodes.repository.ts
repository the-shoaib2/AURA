import { Service } from '@aura/di';
import { DataSource, Repository } from '@aura/typeorm';

import { InstalledNodes } from '../entities';

@Service()
export class InstalledNodesRepository extends Repository<InstalledNodes> {
	constructor(dataSource: DataSource) {
		super(InstalledNodes, dataSource.manager);
	}
}
