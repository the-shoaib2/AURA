import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/vue3';

import auraInput from './Input.vue';
import auraIcon from '../auraIcon';

export default {
	title: 'Atoms/Input',
	component: auraInput,
	argTypes: {
		type: {
			control: 'select',
			options: ['text', 'textarea', 'number', 'password', 'email'],
		},
		placeholder: {
			control: 'text',
		},
		disabled: {
			control: {
				type: 'boolean',
			},
		},
		size: {
			control: 'select',
			options: ['xlarge', 'large', 'medium', 'small', 'mini'],
		},
	},
	parameters: {
		backgrounds: { default: '--color-background-light' },
	},
};

const methods = {
	onUpdateModelValue: action('update:modelValue'),
	onFocus: action('focus'),
	onChange: action('change'),
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraInput,
	},
	template:
		'<aura-input v-bind="args" v-model="val" @update:modelValue="onUpdateModelValue" @change="onChange" @focus="onFocus" />',
	data() {
		return {
			val: '',
		};
	},
	methods,
});

export const Input = Template.bind({});
Input.args = {
	placeholder: 'placeholder...',
};

const ManyTemplate: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraInput,
	},
	template:
		'<div class="multi-container"> <aura-input size="xlarge" v-bind="args" v-model="val" @update:modelValue="onUpdateModelValue" @change="onChange" @focus="onFocus" /> <aura-input v-bind="args" v-model="val" @update:modelValue="onUpdateModelValue" @change="onChange" @focus="onFocus" /> <aura-input v-bind="args" size="medium" v-model="val" @update:modelValue="onUpdateModelValue" @change="onChange" @focus="onFocus" /> <aura-input v-bind="args" size="small" v-model="val" @update:modelValue="onUpdateModelValue" @change="onChange" @focus="onFocus" /> <aura-input v-bind="args" v-model="val" size="mini" @update:modelValue="onUpdateModelValue" @change="onChange" @focus="onFocus" /> </div> ',
	methods,
	data() {
		return {
			val: '',
		};
	},
});

export const Text = ManyTemplate.bind({});
Text.args = {
	type: 'text',
	placeholder: 'placeholder...',
};

export const TextArea = ManyTemplate.bind({});
TextArea.args = {
	type: 'textarea',
	placeholder: 'placeholder...',
};

const WithPrefix: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraIcon,
		auraInput,
	},
	template:
		'<aura-input v-bind="args" v-model="val" @update:modelValue="onUpdateModelValue" @change="onChange" @focus="onFocus"><aura-icon icon="clock" slot="prefix" /></aura-input>',
	data() {
		return {
			val: '',
		};
	},
	methods,
});

export const WithPrefixIcon = WithPrefix.bind({});
WithPrefixIcon.args = {
	placeholder: 'placeholder...',
};

const WithSuffix: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraIcon,
		auraInput,
	},
	template:
		'<aura-input v-bind="args" v-model="val" @update:modelValue="onUpdateModelValue" @change="onChange" @focus="onFocus"><aura-icon icon="clock" slot="suffix" /></aura-input>',
	data() {
		return {
			val: '',
		};
	},
	methods,
});

export const WithSuffixIcon = WithSuffix.bind({});
WithSuffixIcon.args = {
	placeholder: 'placeholder...',
};
