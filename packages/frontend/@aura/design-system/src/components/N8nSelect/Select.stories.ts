import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/vue3';

import auraSelect from './Select.vue';
import auraIcon from '../auraIcon';
import auraOption from '../auraOption';

export default {
	title: 'Atoms/Select',
	component: auraSelect,
	argTypes: {
		disabled: {
			control: {
				type: 'boolean',
			},
		},
		size: {
			control: {
				type: 'select',
			},
			options: ['large', 'medium', 'small', 'mini'],
		},
		loading: {
			control: {
				type: 'boolean',
			},
		},
		filterable: {
			control: {
				type: 'boolean',
			},
		},
		defaultFirstOption: {
			control: {
				type: 'boolean',
			},
		},
	},
	parameters: {
		backgrounds: { default: '--color-background-light' },
	},
};

const methods = {
	onUpdateModelValue: action('update:modelValue'),
	onChange: action('change'),
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraSelect,
		auraOption,
		auraIcon,
	},
	template:
		'<aura-select v-bind="args" v-model="val" @update:modelValue="onUpdateModelValue" @change="onChange"><aura-option value="1">op1</aura-option><aura-option value="2">op2</aura-option></aura-select>',
	data() {
		return {
			val: '',
		};
	},
	methods,
});

export const Input = Template.bind({});

export const Filterable = Template.bind({});
Filterable.args = {
	filterable: true,
	defaultFirstOption: true,
};

const selects = ['large', 'medium', 'small', 'mini']
	.map(
		(size) =>
			`<aura-select v-bind="args" v-model="val" @update:modelValue="onUpdateModelValue" @change="onChange" size="${size}"><aura-option value="1">op1</aura-option><aura-option value="2">op2</aura-option></aura-select>`,
	)
	.join('');

const ManyTemplate: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraSelect,
		auraOption,
		auraIcon,
	},
	template: `<div class="multi-container">${selects}</div>`,
	methods,
	data() {
		return {
			val: '',
		};
	},
});

export const Sizes = ManyTemplate.bind({});
Sizes.args = {
	type: 'text',
	label: 'text input:',
	placeholder: 'placeholder...',
};

const selectsWithIcon = ['xlarge', 'large', 'medium', 'small', 'mini']
	.map(
		(size) =>
			`<aura-select v-bind="args" v-model="val" @update:modelValue="onUpdateModelValue" size="${size}"><aura-icon icon="search" slot="prefix" /><aura-option value="1">op1</aura-option><aura-option value="2">op2</aura-option></aura-select>`,
	)
	.join('');

const ManyTemplateWithIcon: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraSelect,
		auraOption,
		auraIcon,
	},
	template: `<div class="multi-container">${selectsWithIcon}</div>`,
	methods,
	data() {
		return {
			val: '',
		};
	},
});

export const WithIcon = ManyTemplateWithIcon.bind({});
WithIcon.args = {
	type: 'text',
	label: 'text input:',
	placeholder: 'placeholder...',
};

const LimitedWidthTemplate: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraSelect,
		auraOption,
		auraIcon,
	},
	template:
		'<div style="width:100px;"><aura-select v-bind="args" v-model="val" @update:modelValue="onUpdateModelValue" @change="onChange"><aura-option value="1" label="opt1 11 1111" /><aura-option value="2" label="opt2 test very long ipsum"/></aura-select></div>',
	data() {
		return {
			val: '',
		};
	},
	methods,
});

export const LimitedWidth = LimitedWidthTemplate.bind({});
LimitedWidth.args = {
	type: 'text',
	label: 'text input:',
	placeholder: 'placeholder...',
};
