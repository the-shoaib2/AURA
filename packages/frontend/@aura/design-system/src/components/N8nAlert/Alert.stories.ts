import type { StoryFn } from '@storybook/vue3';

import auraAlert from './Alert.vue';
import auraIcon from '../auraIcon';

export default {
	title: 'Atoms/Alert',
	component: auraAlert,
	argTypes: {
		type: {
			type: 'select',
			options: ['success', 'info', 'warning', 'error'],
		},
		effect: {
			type: 'select',
			options: ['light', 'dark'],
		},
	},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraAlert,
	},
	template:
		'<div style="position: relative; width: 100%; height: 300px;"><aura-alert v-bind="args"><template #aside>custom content slot</template></aura-alert></div>',
});

export const ContentAsProps = Template.bind({});
ContentAsProps.args = {
	type: 'info',
	effect: 'light',
	title: 'Alert title',
	description: 'Alert description',
	center: false,
	showIcon: true,
	background: true,
};

const TemplateForSlots: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraAlert,
		auraIcon,
	},
	template: `<div style="position: relative; width: 100%; height: 300px;">
			  <aura-alert v-bind="args">
					<template #title>Title</template>
					Description
					<template #aside><button>Button</button></template>
					<template #icon>
						<aura-icon icon="grin-stars" size="xlarge" />
					</template>
				</aura-alert>
		</div>`,
});

export const ContentInSlots = TemplateForSlots.bind({});
ContentInSlots.args = {
	type: 'info',
	effect: 'light',
	center: false,
	background: true,
	showIcon: false,
};
