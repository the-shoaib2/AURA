import type { INodeTypeDescription } from 'aura-workflow';

import { paginatedRequest } from './strapi-utils';

export type StrapiCommunityNodeType = {
	authorGithubUrl: string;
	authorName: string;
	checksum: string;
	description: string;
	displayName: string;
	name: string;
	numberOfStars: number;
	numberOfDownloads: number;
	packageName: string;
	createdAt: string;
	updatedAt: string;
	npmVersion: string;
	isOfficialNode: boolean;
	companyName?: string;
	nodeDescription: INodeTypeDescription;
	nodeVersions?: Array<{ npmVersion: string; checksum: string }>;
};

const AURA_VETTED_NODE_TYPES_STAGING_URL = 'https://api-staging.aura.io/api/community-nodes';
const AURA_VETTED_NODE_TYPES_PRODUCTION_URL = 'https://api.aura.io/api/community-nodes';

export async function getCommunityNodeTypes(
	environment: 'staging' | 'production',
): Promise<StrapiCommunityNodeType[]> {
	const url =
		environment === 'production'
			? AURA_VETTED_NODE_TYPES_PRODUCTION_URL
			: AURA_VETTED_NODE_TYPES_STAGING_URL;

	return await paginatedRequest<StrapiCommunityNodeType>(url);
}
