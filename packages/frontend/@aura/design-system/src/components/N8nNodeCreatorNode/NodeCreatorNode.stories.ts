import type { StoryFn } from '@storybook/vue3';

import auraNodeCreatorNode from './NodeCreatorNode.vue';

export default {
	title: 'Modules/Node Creator Node',
	component: auraNodeCreatorNode,
};

const DefaultTemplate: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraNodeCreatorNode,
	},
	template: `
		<aura-node-creator-node v-bind="args">
			<template #icon>
				<img src="https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/cartman.svg" />
			</template>
		</aura-node-creator-node>
	`,
});

export const WithTitle = DefaultTemplate.bind({});
WithTitle.args = {
	title: 'Node with title',
	tooltipHtml: '<b>Bold</b> tooltip',
	description:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et vehicula ipsum, eu facilisis lacus. Aliquam commodo vel elit eget mollis. Quisque ac elit non purus iaculis placerat. Quisque fringilla ultrices nisi sed porta.',
};

const PanelTemplate: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraNodeCreatorNode,
	},
	data() {
		return {
			isPanelActive: false,
		};
	},
	template: `
		<aura-node-creator-node v-bind="args" :isPanelActive="isPanelActive" @click.capture="isPanelActive = true">
			<template #icon>
				<img src="https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/cartman.svg" />
			</template>
			<template #panel>
				<p style="width: 100%; height: 300px; background: white">Lorem ipsum dolor sit amet</p>
				<button @click="isPanelActive = false">Close</button>
			</template>
		</aura-node-creator-node>
	`,
});
export const WithPanel = PanelTemplate.bind({});
WithPanel.args = {
	title: 'Node with panel',
	isTrigger: true,
};
