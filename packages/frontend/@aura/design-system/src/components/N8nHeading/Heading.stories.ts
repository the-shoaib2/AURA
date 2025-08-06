import type { StoryFn } from '@storybook/vue3';

import auraHeading from './Heading.vue';

export default {
	title: 'Atoms/Heading',
	component: auraHeading,
	argTypes: {
		size: {
			control: {
				type: 'select',
			},
			options: ['2xlarge', 'xlarge', 'large', 'medium', 'small'],
		},
		color: {
			control: {
				type: 'select',
			},
			options: ['primary', 'text-dark', 'text-base', 'text-light', 'text-xlight'],
		},
	},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraHeading,
	},
	template: '<aura-heading v-bind="args">hello world</aura-heading>',
});

export const Heading = Template.bind({});
