import type { StoryFn } from '@storybook/vue3';

import auraBlockUi from './BlockUi.vue';

export default {
	title: 'Atoms/BlockUI',
	component: auraBlockUi,
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraBlockUi,
	},
	template:
		'<div style="position: relative; width: 100%; height: 300px;"><aura-block-ui v-bind="args" /></div>',
});

export const BlockUi = Template.bind({});
BlockUi.args = {
	show: false,
};
