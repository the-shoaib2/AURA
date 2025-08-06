import type { AllRolesMap } from '@aura/permissions';

import type { IRestApiContext } from '../types';
import { makeRestApiRequest } from '../utils';

export const getRoles = async (context: IRestApiContext): Promise<AllRolesMap> => {
	return await makeRestApiRequest(context, 'GET', '/roles');
};
