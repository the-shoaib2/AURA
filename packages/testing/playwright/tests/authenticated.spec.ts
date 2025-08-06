import { test, expect } from '../fixtures/base';

test('default signin is as owner', async ({ aura }) => {
	await aura.goHome();
	await expect(aura.page).toHaveURL(/\/workflow/);
});

test('owner can access dashboard @auth:owner', async ({ aura }) => {
	await aura.goHome();
	await expect(aura.page).toHaveURL(/\/workflow/);
});

test('admin can access dashboard @auth:admin', async ({ aura }) => {
	await aura.goHome();
	await expect(aura.page).toHaveURL(/\/workflow/);
});

test('member can access dashboard @auth:member', async ({ aura }) => {
	await aura.goHome();
	await expect(aura.page).toHaveURL(/\/workflow/);
});

test('no auth can not access dashboard @auth:none', async ({ aura }) => {
	await aura.goHome();
	await expect(aura.page).toHaveURL(/\/signin/);
});
