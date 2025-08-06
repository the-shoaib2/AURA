import type { StoryFn } from '@storybook/vue3';

import auraKeyboardShorcut from './auraKeyboardShortcut.vue';

export default {
	title: 'Atoms/KeyboardShortcut',
	component: auraKeyboardShorcut,
};

const template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraKeyboardShorcut,
	},
	template: '<aura-keyboard-shortcut v-bind="args" />',
});

export const defaultShortcut = template.bind({});
defaultShortcut.args = {
	keys: ['s'],
	altKey: true,
	metaKey: true,
	shiftKey: true,
};
