import type { StoryFn } from '@storybook/vue3';

import auraUserInfo from './UserInfo.vue';

export default {
	title: 'Modules/UserInfo',
	component: auraUserInfo,
	parameters: {
		backgrounds: { default: '--color-background-light' },
	},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraUserInfo,
	},
	template: '<aura-user-info v-bind="args" />',
});

export const Member = Template.bind({});
Member.args = {
	firstName: 'Oscar',
	lastName: 'Wilde',
	email: 'test@aura.io',
};

export const Current = Template.bind({});
Current.args = {
	firstName: 'Ham',
	lastName: 'Sam',
	email: 'test@aura.io',
	isCurrentUser: true,
};

export const Invited = Template.bind({});
Invited.args = {
	email: 'test@aura.io',
	isPendingUser: true,
};
