import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/vue3';

import auraIconPicker from './IconPicker.vue';
import { type IconOrEmoji } from './types';

export default {
	title: 'Atoms/Icon Picker',
	component: auraIconPicker,
	argTypes: {
		buttonTooltip: {
			control: 'text',
		},
		buttonSize: {
			type: 'select',
			options: ['small', 'large'],
		},
	},
};

function createTemplate(icon: IconOrEmoji): StoryFn {
	return (args, { argTypes }) => ({
		components: { auraIconPicker },
		props: Object.keys(argTypes),
		setup: () => ({ args }),
		data: () => ({
			icon,
		}),
		template:
			'<div style="height: 500px"><aura-icon-picker v-model="icon" v-bind="args" @update:model-value="onIconSelected" /></div>',
		methods: {
			onIconSelected: action('iconSelected'),
		},
	});
}

const DefaultTemplate = createTemplate({ type: 'icon', value: 'smile' });
export const Default = DefaultTemplate.bind({});
Default.args = {
	buttonTooltip: 'Select an icon',
};

const CustomTooltipTemplate = createTemplate({ type: 'icon', value: 'layers' });
export const WithCustomIconAndTooltip = CustomTooltipTemplate.bind({});
WithCustomIconAndTooltip.args = {
	buttonTooltip: 'Select something...',
};

const OnlyEmojiTemplate = createTemplate({ type: 'emoji', value: '🔥' });
export const OnlyEmojis = OnlyEmojiTemplate.bind({});
OnlyEmojis.args = {
	buttonTooltip: 'Select an emoji',
	availableIcons: [],
};
