import type { auraPage } from '../pages/auraPage';

/**
 * A class for user interactions with workflows that go across multiple pages.
 */
export class WorkflowComposer {
	constructor(private readonly aura:auraraPage) {}

	/**
	 * Executes a successful workflow and waits for the notification to be closed.
	 * This waits for http calls and also closes the notification.
	 */
	async executeWorkflowAndWaitForNotification(
		notificationMessage: string,
		options: { timeout?: number } = {},
	) {
		const { timeout = 3000 } = options;
		const responsePromise = this.aura.page.waitForResponse(
			(response) =>
				response.url().includes('/rest/workflows/') &&
				response.url().includes('/run') &&
				response.request().method() === 'POST',
		);

		await this.aura.canvas.clickExecuteWorkflowButton();
		await responsePromise;
		await this.aura.notifications.waitForNotificationAndClose(notificationMessage, { timeout });
	}
}
