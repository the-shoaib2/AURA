import type { IDataObject } from 'aura-workflow';

import type { IMembershipDto } from './CommonDtos';

const UserStatuses = {
	ACTIVE: 0,
	PENDING_EMAIL_VERIFICATION: 1,
	DELETED: 2,
};

export type UserStatusEnum = (typeof UserStatuses)[keyof typeof UserStatuses];

export interface IUserDto {
	activeWorkspace: string;
	defaultWorkspace: string;
	email: string;
	id: string;
	memberships: IMembershipDto[];
	name: string;
	profilePicture: string;
	settings: IDataObject;
	status: UserStatusEnum;
}
