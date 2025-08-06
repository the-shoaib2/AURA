import type { IDataObject } from 'aura-workflow';

export interface IDimension {
	height?: string;
	length?: string;
	width?: string;
}

export interface IImage {
	alt?: string;
	name?: string;
	src?: string;
}

export interface IProduct {
	[index: string]:
		| string
		| number
		| string[]
		| number[]
		| IDataObject
		| IDataObject[]
		| IImage[]
		| IDimension;
}
