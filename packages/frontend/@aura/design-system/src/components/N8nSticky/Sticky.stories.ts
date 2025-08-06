import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/vue3';

import auraSticky from './Sticky.vue';

export default {
	title: 'Atoms/Sticky',
	component: auraSticky,
	argTypes: {
		content: {
			control: {
				control: 'text',
			},
		},
		height: {
			control: {
				control: 'number',
			},
		},
		minHeight: {
			control: {
				control: 'number',
			},
		},
		minWidth: {
			control: {
				control: 'number',
			},
		},
		readOnly: {
			control: {
				control: 'Boolean',
			},
		},
		width: {
			control: {
				control: 'number',
			},
		},
	},
};

const methods = {
	onInput: action('update:modelValue'),
	onResize: action('resize'),
	onResizeEnd: action('resizeend'),
	onResizeStart: action('resizestart'),
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraSticky,
	},
	template:
		'<aura-sticky v-bind="args"  @resize="onResize" @resizeend="onResizeEnd" @resizeStart="onResizeStart" @input="onInput"></aura-sticky>',
	methods,
});

export const Sticky = Template.bind({});
Sticky.args = {
	height: 160,
	width: 150,
	modelValue:
		"## I'm a note \n**Double click** to edit me. [Guide](https://docs.aura.io/workflows/sticky-notes/)",
	minHeight: 80,
	minWidth: 150,
	readOnly: false,
};
