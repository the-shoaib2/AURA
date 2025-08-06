import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/vue3';

import auraInfoAccordion from './InfoAccordion.vue';

export default {
	title: 'Atoms/Info Accordion',
	component: auraInfoAccordion,
	argTypes: {},
	parameters: {
		backgrounds: { default: '--color-background-light' },
	},
};

const methods = {
	onClick: action('click'),
};

export const Default: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraInfoAccordion,
	},
	template: '<aura-info-accordion v-bind="args" @click="onClick" />',
	methods,
});

Default.args = {
	title: 'my title',
	description: 'my description',
};
