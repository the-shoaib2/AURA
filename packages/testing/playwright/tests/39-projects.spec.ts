import { test, expect } from '../fixtures/base';
import { auraPage } from '../pages/auraPage';
import type { ApiHelpers } from '../services/api-helper';

const MANUAL_TRIGGER_NODE_NAME = 'Manual Trigger';
const EXECUTE_WORKFLOW_NODE_NAME = 'Execute Sub-workflow';
const NOTION_NODE_NAME = 'Notion';
const NOTION_API_KEY = 'abc123Playwright';

// Example of using API calls in a test
async function getCredentialsForProject(api: ApiHelpers, projectId?: string) {
	const params = new URLSearchParams({
		includeScopes: 'true',
		includeData: 'true',
		...(projectId && { filter: JSON.stringify({ projectId }) }),
	});
	return await api.get('/rest/credentials', params);
}

test.describe('Projects @db:reset', () => {
	test.beforeEach(async ({ api, aura }) => {
		await api.enableFeature('sharing');
		await api.enableFeature('folders');
		await api.enableFeature('advancedPermissions');
		await api.enableFeature('projectRole:admin');
		await api.enableFeature('projectRole:editor');
		await api.setMaxTeamProjectsQuota(-1);
		await aura.goHome();
	});

	test('should not show project add button and projects to a member if not invited to any project @auth:member', async ({
		aura,
	}) => {
		await expect(aura.sideBar.getAddFirstProjectButton()).toBeDisabled();
		await expect(aura.sideBar.getProjectMenuItems()).toHaveCount(0);
	});

	test('should filter credentials by project ID', async ({ aura, api }) => {
		const { projectName, projectId } = await aura.projectComposer.createProject();
		await aura.projectComposer.addCredentialToProject(
			projectName,
			'Notion API',
			'apiKey',
			NOTION_API_KEY,
		);

		const credentials = await getCredentialsForProject(api, projectId);
		expect(credentials).toHaveLength(1);

		const { projectId: project2Id } = await aura.projectComposer.createProject();
		const credentials2 = await getCredentialsForProject(api, project2Id);
		expect(credentials2).toHaveLength(0);
	});

	test('should create sub-workflow and credential in the sub-workflow in the same project @auth:owner', async ({
		aura,
	}) => {
		const { projectName } = await aura.projectComposer.createProject();
		await aura.sideBar.addWorkflowFromUniversalAdd(projectName);
		await aura.canvas.addNode(MANUAL_TRIGGER_NODE_NAME);
		await aura.canvas.saveWorkflow();
		await expect(
			aura.page.getByText('Workflow successfully created', { exact: false }),
		).toBeVisible();

		await aura.canvas.addNodeToCanvasWithSubItem(
			EXECUTE_WORKFLOW_NODE_NAME,
			'Execute A Sub Workflow',
		);

		const subWorkflowPagePromise = aura.page.waitForEvent('popup');

		await aura.ndv.selectWorkflowResource(`Create a Sub-Workflow in '${projectName}'`);

		const subaura = newauraraPage(await subWorkflowPagePromise);

		await subaura.ndv.clickBackToCanvasButton();

		await subaura.canvas.deleteNodeByName('Replace me with your logic');
		await subaura.canvas.addNodeToCanvasWithSubItem(NOTION_NODE_NAME, 'Append a block');

		await subaura.credentials.createAndSaveNewCredential('apiKey', NOTION_API_KEY);

		await subaura.ndv.clickBackToCanvasButton();
		await subaura.canvas.saveWorkflow();

		await subaura.page.goto('/home/workflows');
		await subaura.projectWorkflows.clickProjectMenuItem(projectName);
		await subaura.page.getByRole('link', { name: 'Workflows' }).click();

		// Get Workflow Count

		await expect(subaura.page.locator('[data-test-id="resources-list-item-workflow"]')).toHaveCount(
			2,
		);

		// Assert that the sub-workflow is in the list
		await expect(subaura.page.getByRole('heading', { name: 'My Sub-Workflow' })).toBeVisible();

		// Navigate to Credentials
		await subaura.page.getByRole('link', { name: 'Credentials' }).click();

		// Assert that the credential is in the list
		await expect(subaura.page.locator('[data-test-id="resources-list-item"]')).toHaveCount(1);
		await expect(subaura.page.getByRole('heading', { name: 'Notion account' })).toBeVisible();
	});
});
