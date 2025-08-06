import { Container } from '@aura/di';

import { UnknownModuleError } from '../errors/unknown-module.error';
import { ModulesConfig } from '../modules.config';

beforeEach(() => {
	jest.resetAllMocks();
	process.env = {};
	Container.reset();
});

it('should throw `UnknownModuleError` if any enabled module name is invalid', () => {
	process.env.aura_ENABLED_MODULES = 'insights,invalidModule';
	expect(() => Container.get(ModulesConfig)).toThrowError(UnknownModuleError);
});

it('should throw `UnknownModuleError` if any disabled module name is invalid', () => {
	process.env.aura_DISABLED_MODULES = 'insights,invalidModule';
	expect(() => Container.get(ModulesConfig)).toThrowError(UnknownModuleError);
});
