import type { StoryFn } from '@storybook/vue3';

import auraCard from './Card.vue';
import auraButton from '../auraButton/Button.vue';
import auraIcon from '../auraIcon/Icon.vue';
import auraText from '../auraText/Text.vue';

export default {
	title: 'Atoms/Card',
	component: auraCard,
};

export const Default: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraCard,
	},
	template: '<aura-card v-bind="args">This is a card.</aura-card>',
});

export const Hoverable: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraCard,
		auraIcon,
		auraText,
	},
	template: `<div style="width: 140px; text-align: center;">
		<aura-card v-bind="args">
			<aura-icon icon="plus" size="xlarge" />
			<aura-text size="large" class="mt-2xs">Add</aura-text>
		</aura-card>
	</div>`,
});

Hoverable.args = {
	hoverable: true,
};

export const WithSlots: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraCard,
		auraButton,
		auraIcon,
		auraText,
	},
	template: `<aura-card v-bind="args">
		<template #prepend>
			<aura-icon icon="check" size="large" />
		</template>
		<template #header>
			<strong>Card header</strong>
		</template>
		<aura-text color="text-light" size="medium" class="mt-2xs mb-2xs">
			This is the card body.
		</aura-text>
		<template #footer>
			<aura-text size="medium">
				Card footer
			</aura-text>
		</template>
		<template #append>
			<aura-button>Click me</aura-button>
		</template>
	</aura-card>`,
});
