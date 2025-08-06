import { DynamicStructuredTool, DynamicTool } from '@langchain/core/tools';
import { createMockExecuteFunction } from 'aura-nodes-base/test/nodes/Helpers';
import type { INode, ISupplyDataFunctions } from 'aura-workflow';
import { z } from 'zod';

import { auraTool } from './auraTool';

const mockNode: INode = {
	id: '1',
	name: 'Mock node',
	typeVersion: 2,
	type: 'aura-nodes-base.mock',
	position: [60, 760],
	parameters: {
		operation: 'test',
	},
};

describe('Test auraTool wrapper as DynamicStructuredTool', () => {
	it('should wrap a tool', () => {
		const func = jest.fn();

		const ctx = createMockExecuteFunction<ISupplyDataFunctions>({}, mockNode);

		const tool = new auraTool(ctx, {
			name: 'Dummy Tool',
			description: 'A dummy tool for testing',
			func,
			schema: z.object({
				foo: z.string(),
			}),
		});

		expect(tool).toBeInstanceOf(DynamicStructuredTool);
	});
});

describe('Test auraTool wrapper - DynamicTool fallback', () => {
	it('should convert the tool to a dynamic tool', () => {
		const func = jest.fn();

		const ctx = createMockExecuteFunction<ISupplyDataFunctions>({}, mockNode);

		const tool = new auraTool(ctx, {
			name: 'Dummy Tool',
			description: 'A dummy tool for testing',
			func,
			schema: z.object({
				foo: z.string(),
			}),
		});

		const dynamicTool = tool.asDynamicTool();

		expect(dynamicTool).toBeInstanceOf(DynamicTool);
	});

	it('should format fallback description correctly', () => {
		const func = jest.fn();

		const ctx = createMockExecuteFunction<ISupplyDataFunctions>({}, mockNode);

		const tool = new auraTool(ctx, {
			name: 'Dummy Tool',
			description: 'A dummy tool for testing',
			func,
			schema: z.object({
				foo: z.string(),
				bar: z.number().optional(),
				qwe: z.boolean().describe('Boolean description'),
			}),
		});

		const dynamicTool = tool.asDynamicTool();

		expect(dynamicTool.description).toContain('foo: (description: , type: string, required: true)');
		expect(dynamicTool.description).toContain(
			'bar: (description: , type: number, required: false)',
		);

		expect(dynamicTool.description).toContain(
			'qwe: (description: Boolean description, type: boolean, required: true)',
		);
	});

	it('should handle empty parameter list correctly', () => {
		const func = jest.fn();

		const ctx = createMockExecuteFunction<ISupplyDataFunctions>({}, mockNode);

		const tool = new auraTool(ctx, {
			name: 'Dummy Tool',
			description: 'A dummy tool for testing',
			func,
			schema: z.object({}),
		});

		const dynamicTool = tool.asDynamicTool();

		expect(dynamicTool.description).toEqual('A dummy tool for testing');
	});

	it('should parse correct parameters', async () => {
		const func = jest.fn();

		const ctx = createMockExecuteFunction<ISupplyDataFunctions>({}, mockNode);

		const tool = new auraTool(ctx, {
			name: 'Dummy Tool',
			description: 'A dummy tool for testing',
			func,
			schema: z.object({
				foo: z.string().describe('Foo description'),
				bar: z.number().optional(),
			}),
		});

		const dynamicTool = tool.asDynamicTool();

		const testParameters = { foo: 'some value' };

		await dynamicTool.func(JSON.stringify(testParameters));

		expect(func).toHaveBeenCalledWith(testParameters);
	});

	it('should recover when 1 parameter is passed directly', async () => {
		const func = jest.fn();

		const ctx = createMockExecuteFunction<ISupplyDataFunctions>({}, mockNode);

		const tool = new auraTool(ctx, {
			name: 'Dummy Tool',
			description: 'A dummy tool for testing',
			func,
			schema: z.object({
				foo: z.string().describe('Foo description'),
			}),
		});

		const dynamicTool = tool.asDynamicTool();

		const testParameter = 'some value';

		await dynamicTool.func(testParameter);

		expect(func).toHaveBeenCalledWith({ foo: testParameter });
	});

	it('should recover when JS object is passed instead of JSON', async () => {
		const func = jest.fn();

		const ctx = createMockExecuteFunction<ISupplyDataFunctions>({}, mockNode);

		const tool = new auraTool(ctx, {
			name: 'Dummy Tool',
			description: 'A dummy tool for testing',
			func,
			schema: z.object({
				foo: z.string().describe('Foo description'),
			}),
		});

		const dynamicTool = tool.asDynamicTool();

		await dynamicTool.func('{ foo: "some value" }');

		expect(func).toHaveBeenCalledWith({ foo: 'some value' });
	});
});
