import type { StoryFn } from '@storybook/vue3';

import auraPopover from './Popover.vue';

export default {
	title: 'Atoms/Popover',
	component: auraPopover,
	argTypes: {
		effect: {
			control: 'select',
			options: ['dark', 'light'],
		},
		placement: {
			control: 'select',
			options: [
				'top',
				'top-start',
				'top-end',
				'bottom',
				'bottom-start',
				'bottom-end',
				'left',
				'left-start',
				'left-end',
				'right',
				'right-start',
				'right-end',
			],
		},
		disabled: {
			control: { type: 'boolean' },
		},
	},
	parameters: {
		backgrounds: { default: '--color-background-light' },
	},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraPopover,
	},
	template: `<aura-popover v-bind="args">
			<div style="margin:50px; display: inline-block;">
				<span>yo</span>
			</div>
			<template #content>
				Popover
			</template>
		</aura-popover>`,
});

export const Popover = Template.bind({});
Popover.args = {
	content: '...',
};
