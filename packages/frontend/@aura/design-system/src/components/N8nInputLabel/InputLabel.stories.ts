import type { StoryFn } from '@storybook/vue3';

import auraInputLabel from './InputLabel.vue';
import auraInput from '../auraInput';

export default {
	title: 'Atoms/Input Label',
	component: auraInputLabel,
	argTypes: {},
	parameters: {
		backgrounds: { default: '--color-background-light' },
	},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraInputLabel,
		auraInput,
	},
	template: `<div style="margin-top:50px">
			<aura-input-label v-bind="args">
				<aura-input />
			</aura-input-label>
		</div>`,
});

export const InputLabel = Template.bind({});
InputLabel.args = {
	label: 'input label',
	tooltipText: 'more info...',
};
