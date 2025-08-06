import type { StoryFn } from '@storybook/vue3';

import auraLoading from './Loading.vue';

export default {
	title: 'Atoms/Loading',
	component: auraLoading,
	argTypes: {
		animated: {
			control: {
				type: 'boolean',
			},
		},
		loading: {
			control: {
				type: 'boolean',
			},
		},
		rows: {
			control: {
				type: 'select',
			},
			options: [1, 2, 3, 4, 5],
		},
		variant: {
			control: {
				type: 'select',
			},
			options: ['button', 'h1', 'image', 'p'],
		},
	},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraLoading,
	},
	template: '<aura-loading v-bind="args"></aura-loading>',
});

export const Loading = Template.bind({});
Loading.args = {
	variant: 'p',
};
