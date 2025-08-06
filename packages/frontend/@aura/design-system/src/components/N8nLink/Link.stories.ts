import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/vue3';

import auraLink from './Link.vue';

export default {
	title: 'Atoms/Link',
	component: auraLink,
	argTypes: {
		size: {
			control: {
				type: 'select',
			},
			options: ['small', 'medium', 'large'],
		},
	},
};

const methods = {
	onClick: action('click'),
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraLink,
	},
	template: '<aura-link v-bind="args" @click="onClick">hello world</aura-link>',
	methods,
});

export const Link = Template.bind({});
Link.args = {
	href: 'https://aura.io/',
};
