import type { ICredentialType, INodeProperties } from 'aura-workflow';

export class PagerDutyApi implements ICredentialType {
	name = 'pagerDutyApi';

	displayName = 'PagerDuty API';

	documentationUrl = 'pagerDuty';

	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
