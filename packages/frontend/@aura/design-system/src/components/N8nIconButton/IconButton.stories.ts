import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/vue3';

import auraIconButton from './IconButton.vue';

export default {
	title: 'Atoms/Icon Button',
	component: auraIconButton,
	argTypes: {
		type: {
			control: 'select',
			options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'],
		},
		size: {
			control: {
				type: 'select',
			},
			options: ['mini', 'small', 'medium', 'large', 'xlarge'],
		},
	},
	parameters: {
		backgrounds: { default: '--color-background-light' },
	},
};

const methods = {
	onClick: action('click'),
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraIconButton,
	},
	template: '<aura-icon-button @click="onClick" v-bind="args" />',
	methods,
});

export const Button = Template.bind({});
Button.args = {
	icon: 'plus',
	title: 'my title',
};

const ManyTemplate: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraIconButton,
	},
	template:
		'<div> <aura-icon-button v-bind="args" size="xlarge" @click="onClick" /> <aura-icon-button v-bind="args" size="large" @click="onClick" />  <aura-icon-button v-bind="args" size="medium" @click="onClick" />  <aura-icon-button v-bind="args" size="small" @click="onClick" />  <aura-icon-button v-bind="args" :loading="true" @click="onClick" />  <aura-icon-button v-bind="args" :disabled="true" @click="onClick" /></div>',
	methods,
});

export const Primary = ManyTemplate.bind({});
Primary.args = {
	icon: 'plus',
	title: 'my title',
	type: 'primary',
};

export const Outline = ManyTemplate.bind({});
Outline.args = {
	icon: 'plus',
	title: 'my title',
	type: 'primary',
	outline: true,
};

export const Tertiary = ManyTemplate.bind({});
Tertiary.args = {
	icon: 'plus',
	title: 'my title',
	type: 'tertiary',
};

export const Text = ManyTemplate.bind({});
Text.args = {
	icon: 'plus',
	title: 'my title',
	type: 'text',
};
