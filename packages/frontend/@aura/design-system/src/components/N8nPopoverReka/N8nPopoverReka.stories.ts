import type { StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

import auraPopoverReka from './auraPopoverReka.vue';
import auraButton from '../auraButton/Button.vue';
import auraInput from '../auraInput/Input.vue';

export default {
	title: 'Atoms/PopoverReka',
	component: auraPopoverReka,
	argTypes: {
		enableScrolling: {
			control: 'boolean',
		},
		scrollType: {
			control: 'select',
			options: ['auto', 'always', 'scroll', 'hover'],
		},
		maxHeight: {
			control: 'text',
		},
	},
};

const Template: StoryFn = (args) => ({
	setup() {
		const username = ref('');
		const email = ref('');
		const isOpen = ref(false);

		return { args, username, email, isOpen };
	},
	components: {
		auraPopoverReka,
		auraButton,
		auraInput,
	},
	template: `
		<div style="padding: 50px;">
			<auraPopoverReka v-model:open="isOpen" v-bind="args">
				<template #trigger>
					<auraButton type="primary">Open Form</auraButton>
				</template>
				<template #content="{ close }">
					<div style="display: flex; flex-direction: column; gap: 12px;">
						<h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">User Information</h3>
						<auraInput
							v-model="username"
							placeholder="Enter username"
							label="Username"
						/>
						<auraInput
							v-model="email"
							placeholder="Enter email"
							label="Email"
							type="email"
						/>
						<div style="display: flex; gap: 8px; margin-top: 8px;">
							<auraButton size="small" type="primary">Save</auraButton>
							<auraButton size="small" type="secondary" @click="close">Cancel</auraButton>
						</div>
					</div>
				</template>
			</auraPopoverReka>
		</div>
	`,
});

export const SimpleExample = Template.bind({});
SimpleExample.args = {};
SimpleExample.storyName = 'With Form Inputs';

const ScrollableTemplate: StoryFn = (args) => ({
	setup() {
		const isOpen = ref(false);
		return { args, isOpen };
	},
	components: {
		auraPopoverReka,
		auraButton,
	},
	template: `
		<div style="padding: 50px;">
			<auraPopoverReka v-model:open="isOpen" v-bind="args">
				<template #trigger>
					<auraButton type="primary">Open Scrollable Menu</auraButton>
				</template>
				<template #content="{ close }">
					<div style="display: flex; flex-direction: column; gap: 8px;">
						<h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">Menu Items</h3>
						<div v-for="i in 20" :key="i"
							style="padding: 8px 12px; background: var(--color-background-base); border-radius: 4px; cursor: pointer; min-height: 40px; display: flex; align-items: center;"
							@click="close"
						>
							Menu Item {{ i }}: Some description text that explains what this item does
						</div>
					</div>
				</template>
			</auraPopoverReka>
		</div>
	`,
});

export const WithScrolling = ScrollableTemplate.bind({});
WithScrolling.args = {
	maxHeight: '300px',
	enableScrolling: true,
	scrollType: 'hover',
};
WithScrolling.storyName = 'With Scrollable Content';

export const AlwaysVisibleScrollbars = ScrollableTemplate.bind({});
AlwaysVisibleScrollbars.args = {
	maxHeight: '250px',
	enableScrolling: true,
	scrollType: 'always',
};
AlwaysVisibleScrollbars.storyName = 'Always Visible Scrollbars';
