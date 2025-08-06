import type { Schema } from '@/Interface';
import { pascalCase } from 'change-case';
import { globalTypeDefinition } from './utils';

function processSchema(schema: Schema): string {
	switch (schema.type) {
		case 'string':
		case 'number':
		case 'boolean':
		case 'bigint':
		case 'symbol':
		case 'null':
		case 'undefined':
			return schema.type;

		case 'function':
			return 'Function';

		case 'array':
			if (Array.isArray(schema.value)) {
				if (schema.value.length > 0) {
					return `Array<${processSchema(schema.value[0])}>`;
				}
				return 'any[]';
			}

			return `${schema.value}[]`;

		case 'object':
			if (!Array.isArray(schema.value)) {
				return '{}';
			}

			const properties = schema.value
				.map((prop) => {
					const key = prop.key ?? 'unknown';
					const type = processSchema(prop);
					return `  ${key}: ${type};`;
				})
				.join('\n');

			return `{\n${properties}\n}`;

		default:
			return 'any';
	}
}

export function schemaToTypescriptTypes(schema: Schema, interfaceName: string): string {
	return `interface ${interfaceName} ${processSchema(schema)}`;
}

export async function getDynamicNodeTypes({
	nodeNames,
	loadedNodes,
}: { nodeNames: string[]; loadedNodes: Map<string, { type: string; typeName: string }> }) {
	return globalTypeDefinition(`
type NodeName = ${nodeNames.map((name) => `'${name}'`).join(' | ')};

${Array.from(loadedNodes.values())
	.map(({ type }) => type)
	.join(';\n')}

interface NodeDataMap {
    ${Array.from(loadedNodes.entries())
			.map(
				([nodeName, { typeName }]) =>
					`'${nodeName}': NodeData<${typeName}Context, ${typeName}Json, ${typeName}BinaryKeys, ${typeName}Params>`,
			)
			.join(';\n')}
}
`);
}

export async function getDynamicInputNodeTypes(inputNodeNames: string[]) {
	const typeNames = inputNodeNames.map((nodeName) => pascalCase(nodeName));

	return globalTypeDefinition(`
type auraInputJson = ${typeNames.map((typeName) => `${typeName}Json`).join(' | ')};
type auraInputBinaryKeys = ${typeNames.map((typeName) => `${typeName}BinaryKeys`).join(' | ')};
type auraInputContext = ${typeNames.map((typeName) => `${typeName}Context`).join(' | ')};
type auraInputParams = ${typeNames.map((typeName) => `${typeName}Params`).join(' | ')};
`);
}

export async function getDynamicVariableTypes(variables: string[]) {
	return globalTypeDefinition(`
	interface auraVars {
	${variables.map((key) => `${key}: string;`).join('\n')}
}`);
}
