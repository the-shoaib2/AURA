import type { StoryFn } from '@storybook/vue3';

import auraPulse from './Pulse.vue';

export default {
	title: 'Atoms/Pulse',
	component: auraPulse,
	argTypes: {},
	parameters: {
		backgrounds: { default: '--color-background-light' },
	},
};

export const Default: StoryFn = () => ({
	components: {
		auraPulse,
	},
	template: '<aura-pulse> yo </aura-pulse>',
});
