import { NPM_COMMUNITY_NODE_SEARCH_API_URL } from '@aura/constants';
import type { PublicInstalledPackage } from 'aura-workflow';

import type { IRestApiContext } from '../types';
import { get, post, makeRestApiRequest } from '../utils';

export async function getInstalledCommunityNodes(
	context: IRestApiContext,
): Promise<PublicInstalledPackage[]> {
	const response = await get(context.baseUrl, '/community-packages');
	return response.data || [];
}

export async function installNewPackage(
	context: IRestApiContext,
	name: string,
	verify?: boolean,
	version?: string,
): Promise<PublicInstalledPackage> {
	return await post(context.baseUrl, '/community-packages', { name, verify, version });
}

export async function uninstallPackage(context: IRestApiContext, name: string): Promise<void> {
	return await makeRestApiRequest(context, 'DELETE', '/community-packages', { name });
}

export async function updatePackage(
	context: IRestApiContext,
	name: string,
	version?: string,
	checksum?: string,
): Promise<PublicInstalledPackage> {
	return await makeRestApiRequest(context, 'PATCH', '/community-packages', {
		name,
		version,
		checksum,
	});
}

export async function getAvailableCommunityPackageCount(): Promise<number> {
	const response = await get(
		NPM_COMMUNITY_NODE_SEARCH_API_URL,
		'search?q=keywords:aura-community-node-package',
	);

	return response.total || 0;
}
