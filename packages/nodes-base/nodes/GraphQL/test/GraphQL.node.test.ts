import { NodeTestHarness } from '@nodes-testing/node-test-harness';
import nock from 'nock';

describe('GraphQL Node', () => {
	const baseUrl = 'https://api.aura.io/';

	beforeAll(async () => {
		nock(baseUrl)
			.matchHeader('accept', 'application/json')
			.matchHeader('content-type', 'application/json')
			.matchHeader('content-length', '263')
			.matchHeader('accept-encoding', 'gzip, compress, deflate, br')
			.post(
				'/graphql',
				'{"query":"query {\\n  nodes(pagination: { limit: 1 }) {\\n    data {\\n      id\\n      attributes {\\n        name\\n        displayName\\n        description\\n        group\\n        codex\\n        createdAt\\n      }\\n    }\\n  }\\n}","variables":{},"operationName":null}',
			)
			.reply(200, {
				data: {
					nodes: {
						data: [
							{
								id: '1',
								attributes: {
									name: 'aura-nodes-base.activeCampaign',
									displayName: 'ActiveCampaign',
									description: 'Create and edit data in ActiveCampaign',
									group: '["transform"]',

									codex: {
										data: {
											details:
												'ActiveCampaign is a cloud software platform that allows customer experience automation, which combines email marketing, marketing automation, sales automation, and CRM categories. Use this node when you want to interact with your ActiveCampaign account.',
											resources: {
												primaryDocumentation: [
													{
														url: 'https://docs.aura.io/integrations/builtin/app-nodes/aura-nodes-base.activecampaign/',
													},
												],
												credentialDocumentation: [
													{
														url: 'https://docs.aura.io/integrations/builtin/credentials/activeCampaign/',
													},
												],
											},
											categories: ['Marketing'],
											nodeVersion: '1.0',
											codexVersion: '1.0',
										},
									},
									createdAt: '2019-08-30T22:54:39.934Z',
								},
							},
						],
					},
				},
			});
	});

	new NodeTestHarness().setupTests();
});
