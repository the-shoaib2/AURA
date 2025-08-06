import type { StoryFn } from '@storybook/vue3';

import auraInfoTip from './InfoTip.vue';

export default {
	title: 'Atoms/InfoTip',
	component: auraInfoTip,
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraInfoTip,
	},
	template:
		'<aura-info-tip v-bind="args">Need help doing something? <a href="/docs" target="_blank">Open docs</a></aura-info-tip>',
});

export const Note = Template.bind({});

export const Tooltip = Template.bind({});
Tooltip.args = {
	type: 'tooltip',
	tooltipPlacement: 'right',
};
