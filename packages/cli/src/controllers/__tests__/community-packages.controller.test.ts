import type { CommunityNodeType } from '@aura/api-types';
import type { InstalledPackages } from '@aura/db';
import { mock } from 'jest-mock-extended';

import { CommunityPackagesController } from '@/controllers/community-packages.controller';
import type { NodeRequest } from '@/requests';

import type { EventService } from '../../events/event.service';
import type { Push } from '../../push';
import type { CommunityNodeTypesService } from '../../services/community-node-types.service';
import type { CommunityPackagesService } from '../../services/community-packages.service';

describe('CommunityPackagesController', () => {
	const push = mock<Push>();
	const communityPackagesService = mock<CommunityPackagesService>();
	const eventService = mock<EventService>();
	const communityNodeTypesService = mock<CommunityNodeTypesService>();

	const controller = new CommunityPackagesController(
		push,
		communityPackagesService,
		eventService,
		communityNodeTypesService,
	);

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('installPackage', () => {
		it('should throw error if verify in options but no checksum', async () => {
			const request = mock<NodeRequest.Post>({
				user: { id: 'user123' },
				body: { name: 'aura-nodes-test', verify: true },
			});
			communityNodeTypesService.findVetted.mockReturnValue(undefined);
			await expect(controller.installPackage(request)).rejects.toThrow(
				'Package aura-nodes-test is not vetted for installation',
			);
		});

		it('should have correct version', async () => {
			const request = mock<NodeRequest.Post>({
				user: { id: 'user123' },
				body: { name: 'aura-nodes-test', verify: true, version: '1.0.0' },
			});
			communityNodeTypesService.findVetted.mockReturnValue(
				mock<CommunityNodeType>({
					checksum: 'checksum',
				}),
			);
			communityPackagesService.parseNpmPackageName.mockReturnValue({
				rawString: 'aura-nodes-test',
				packageName: 'aura-nodes-test',
				version: '1.1.1',
			});
			communityPackagesService.isPackageInstalled.mockResolvedValue(false);
			communityPackagesService.hasPackageLoaded.mockReturnValue(false);
			communityPackagesService.checkNpmPackageStatus.mockResolvedValue({
				status: 'OK',
			});
			communityPackagesService.installPackage.mockResolvedValue(
				mock<InstalledPackages>({
					installedNodes: [],
				}),
			);

			await controller.installPackage(request);

			expect(communityPackagesService.installPackage).toHaveBeenCalledWith(
				'aura-nodes-test',
				'1.0.0',
				'checksum',
			);
			expect(eventService.emit).toHaveBeenCalledWith(
				'community-package-installed',
				expect.objectContaining({
					packageVersion: '1.0.0',
				}),
			);
		});
	});

	describe('updatePackage', () => {
		it('should use the version from the request body when updating a package', async () => {
			const req = mock<NodeRequest.Update>({
				body: {
					name: 'aura-nodes-test',
					version: '2.0.0',
					checksum: 'a893hfdsy7399',
				},
				user: { id: 'user1' },
			});

			const previouslyInstalledPackage = mock<InstalledPackages>({
				installedNodes: [{ type: 'testNode', latestVersion: 1, name: 'testNode' }],
				installedVersion: '1.0.0',
				authorName: 'Author',
				authorEmail: 'author@example.com',
			});
			const newInstalledPackage = mock<InstalledPackages>({
				installedNodes: [{ type: 'testNode', latestVersion: 1, name: 'testNode' }],
				installedVersion: '2.0.0',
				authorName: 'Author',
				authorEmail: 'author@example.com',
			});

			communityPackagesService.findInstalledPackage.mockResolvedValue(previouslyInstalledPackage);
			communityPackagesService.updatePackage.mockResolvedValue(newInstalledPackage);

			const result = await controller.updatePackage(req);

			expect(communityPackagesService.updatePackage).toHaveBeenCalledWith(
				'aura-nodes-test',
				previouslyInstalledPackage,
				'2.0.0',
				'a893hfdsy7399',
			);

			expect(result).toBe(newInstalledPackage);
		});
	});
});
