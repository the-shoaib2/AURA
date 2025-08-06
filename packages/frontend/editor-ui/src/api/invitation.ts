import type { CurrentUserResponse, IInviteResponse, InvitableRoleName } from '@/Interface';
import type { IRestApiContext } from '@aura/rest-api-client';
import type { IDataObject } from 'aura-workflow';
import { makeRestApiRequest } from '@aura/rest-api-client';

type AcceptInvitationParams = {
	inviterId: string;
	inviteeId: string;
	firstName: string;
	lastName: string;
	password: string;
};

export async function inviteUsers(
	context: IRestApiContext,
	params: Array<{ email: string; role: InvitableRoleName }>,
) {
	return await makeRestApiRequest<IInviteResponse[]>(context, 'POST', '/invitations', params);
}

export async function acceptInvitation(context: IRestApiContext, params: AcceptInvitationParams) {
	const { inviteeId, ...props } = params;
	return await makeRestApiRequest<CurrentUserResponse>(
		context,
		'POST',
		`/invitations/${params.inviteeId}/accept`,
		props as unknown as IDataObject,
	);
}
