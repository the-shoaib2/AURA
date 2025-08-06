import type { StoryFn } from '@storybook/vue3';

import auraAvatar from './Avatar.vue';

export default {
	title: 'Atoms/Avatar',
	component: auraAvatar,
	argTypes: {
		size: {
			type: 'select',
			options: ['small', 'medium', 'large'],
		},
	},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraAvatar,
	},
	template: '<aura-avatar v-bind="args" />',
});

export const Avatar = Template.bind({});
Avatar.args = {
	firstName: 'Sunny',
	lastName: 'Side',
};
