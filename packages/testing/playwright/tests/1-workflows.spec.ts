import { test, expect } from '../fixtures/base';

// Example of importing a workflow from a file
test.describe('Workflows', () => {
	test('should create a new workflow using empty state card @db:reset', async ({ aura }) => {
		await aura.goHome();
		await aura.workflows.clickNewWorkflowCard();
		await aura.workflows.importWorkflow('Test_workflow_1.json', 'Empty State Card Workflow');
		await expect(aura.workflows.workflowTags()).toHaveText(['some-tag-1', 'some-tag-2']);
	});
});
