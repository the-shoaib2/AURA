import type { User } from '@aura/db';
import { UserRepository } from '@aura/db';
import { Container } from '@aura/di';
// eslint-disable-next-line aura-local-rules/misplaced-aura-typeorm-import
import { In } from '@aura/typeorm';
import pick from 'lodash/pick';
import { validate as uuidValidate } from 'uuid';

export async function getUser(data: {
	withIdentifier: string;
	includeRole?: boolean;
}): Promise<User | null> {
	return await Container.get(UserRepository)
		.findOne({
			where: {
				...(uuidValidate(data.withIdentifier) && { id: data.withIdentifier }),
				...(!uuidValidate(data.withIdentifier) && { email: data.withIdentifier }),
			},
		})
		.then((user) => {
			if (user && !data?.includeRole) delete (user as Partial<User>).role;
			return user;
		});
}

export async function getAllUsersAndCount(data: {
	includeRole?: boolean;
	limit?: number;
	offset?: number;
	in?: string[];
}): Promise<[User[], number]> {
	const { in: _in } = data;

	const users = await Container.get(UserRepository).find({
		where: { ...(_in && { id: In(_in) }) },
		skip: data.offset,
		take: data.limit,
	});
	if (!data?.includeRole) {
		users.forEach((user) => {
			delete (user as Partial<User>).role;
		});
	}
	const count = await Container.get(UserRepository).count();
	return [users, count];
}

const userProperties = [
	'id',
	'email',
	'firstName',
	'lastName',
	'createdAt',
	'updatedAt',
	'isPending',
];
function pickUserSelectableProperties(user: User, options?: { includeRole: boolean }) {
	return pick(user, userProperties.concat(options?.includeRole ? ['role'] : []));
}

export function clean(user: User, options?: { includeRole: boolean }): Partial<User>;
export function clean(users: User[], options?: { includeRole: boolean }): Array<Partial<User>>;

export function clean(
	users: User[] | User,
	options?: { includeRole: boolean },
): Array<Partial<User>> | Partial<User> {
	return Array.isArray(users)
		? users.map((user) => pickUserSelectableProperties(user, options))
		: pickUserSelectableProperties(users, options);
}
