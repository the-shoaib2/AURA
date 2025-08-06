import { expect, test } from '../fixtures/base';

// Example of importing a workflow from a file
test.describe('PDF Test', () => {
	// eslint-disable-next-line playwright/no-skipped-test
	test.skip('Can read and write PDF files and extract text', async ({ aura }) => {
		await aura.goHome();
		await aura.workflows.clickAddWorklowButton();
		await aura.workflows.importWorkflow('test_pdf_workflow.json', 'PDF Workflow');
		await aura.canvas.clickExecuteWorkflowButton();
		await expect(
			aura.notifications.notificationContainerByText('Workflow executed successfully'),
		).toBeVisible();
	});
});
