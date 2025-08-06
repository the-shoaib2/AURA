import { Get, RestController } from '@aura/decorators';

import { RoleService } from '@/services/role.service';

@RestController('/roles')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Get('/')
	getAllRoles() {
		return this.roleService.getAllRoles();
	}
}
