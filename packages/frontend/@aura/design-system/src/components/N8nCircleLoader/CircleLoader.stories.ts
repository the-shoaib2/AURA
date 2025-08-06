import type { StoryFn } from '@storybook/vue3';

import auraCircleLoader from './CircleLoader.vue';

export default {
	title: 'Atoms/CircleLoader',
	component: auraCircleLoader,
	argTypes: {
		radius: {
			control: {
				type: 'number',
			},
		},
		progress: {
			control: {
				type: 'number',
			},
		},
		strokeWidth: {
			control: {
				type: 'number',
			},
		},
	},
};

interface Args {
	radius: number;
	progress: number;
	strokeWidth: number;
}

const template: StoryFn<Args> = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraCircleLoader,
	},
	template: `
		<div>
			<aura-circle-loader v-bind="args" />
		</div>
	`,
});

export const defaultCircleLoader = template.bind({});
defaultCircleLoader.args = {
	radius: 20,
	progress: 42,
	strokeWidth: 10,
};
