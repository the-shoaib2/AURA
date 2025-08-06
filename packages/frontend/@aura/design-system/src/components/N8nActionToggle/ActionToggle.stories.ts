import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/vue3';

import auraActionToggle from './ActionToggle.vue';

export default {
	title: 'Atoms/ActionToggle',
	component: auraActionToggle,
	argTypes: {
		placement: {
			type: 'select',
			options: ['top', 'top-end', 'top-start', 'bottom', 'bottom-end', 'bottom-start'],
		},
		size: {
			type: 'select',
			options: ['mini', 'small', 'medium'],
		},
	},
	parameters: {
		backgrounds: { default: '--color-background-light' },
	},
};

const methods = {
	onAction: action('action'),
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraActionToggle,
	},
	template: `<div style="height:300px; width:300px; display:flex; align-items:center; justify-content:center">
			<aura-action-toggle v-bind="args" @action="onAction" />
		</div>`,
	methods,
});

export const ActionToggle = Template.bind({});
ActionToggle.args = {
	actions: [
		{
			label: 'Go',
			value: 'go',
		},
		{
			label: 'Stop',
			value: 'stop',
		},
	],
};
