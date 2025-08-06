import type { StoryFn } from '@storybook/vue3';

import auraTag from './Tag.vue';

export default {
	title: 'Atoms/Tag',
	component: auraTag,
	argTypes: {
		text: {
			control: {
				control: 'text',
			},
		},
	},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraTag,
	},
	template: '<aura-tag v-bind="args"></aura-tag>',
});

export const Tag = Template.bind({});
Tag.args = {
	text: 'tag name',
};
