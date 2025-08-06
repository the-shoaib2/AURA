import { Config, Env } from '../decorators';

@Config
export class DeploymentConfig {
	@Env('aura_DEPLOYMENT_TYPE')
	type: string = 'default';
}
