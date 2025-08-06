import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/vue3';

import auraButton from './Button.vue';

export default {
	title: 'Atoms/Button',
	component: auraButton,
	argTypes: {
		type: {
			control: 'select',
			options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'],
		},
		size: {
			control: {
				type: 'select',
			},
			options: ['mini', 'small', 'medium', 'large', 'xlarge'],
		},
		float: {
			type: 'select',
			options: ['left', 'right'],
		},
	},
	parameters: {
		design: {
			type: 'figma',
			url: 'https://www.figma.com/file/DxLbnIyMK8X0uLkUguFV4n/aura-design-system_v1?node-id=5%3A1147',
		},
	},
};

const methods = {
	onClick: action('click'),
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraButton,
	},
	template: '<aura-button v-bind="args" @click="onClick" />',
	methods,
});

export const Button = Template.bind({});
Button.args = {
	label: 'Button',
};

const AllSizesTemplate: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraButton,
	},
	template: `<div>
		<aura-button v-bind="args" size="large" @click="onClick" />
		<aura-button v-bind="args" size="medium" @click="onClick" />
		<aura-button v-bind="args" size="small" @click="onClick" />
		<aura-button v-bind="args" :loading="true" @click="onClick" />
		<aura-button v-bind="args" :disabled="true" @click="onClick" />
	</div>`,
	methods,
});

const AllColorsAndSizesTemplate: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraButton,
	},
	template: `<div>
		<aura-button v-bind="args" size="large" type="primary" @click="onClick" />
		<aura-button v-bind="args" size="large" type="secondary" @click="onClick" />
		<aura-button v-bind="args" size="large" type="tertiary" @click="onClick" />
		<aura-button v-bind="args" size="large" type="success" @click="onClick" />
		<aura-button v-bind="args" size="large" type="warning" @click="onClick" />
		<aura-button v-bind="args" size="large" type="danger" @click="onClick" />
		<br/>
		<br/>
		<aura-button v-bind="args" size="medium" type="primary" @click="onClick" />
		<aura-button v-bind="args" size="medium" type="secondary" @click="onClick" />
		<aura-button v-bind="args" size="medium" type="tertiary" @click="onClick" />
		<aura-button v-bind="args" size="medium" type="success" @click="onClick" />
		<aura-button v-bind="args" size="medium" type="warning" @click="onClick" />
		<aura-button v-bind="args" size="medium" type="danger" @click="onClick" />
		<br/>
		<br/>
		<aura-button v-bind="args" size="small" type="primary" @click="onClick" />
		<aura-button v-bind="args" size="small" type="secondary" @click="onClick" />
		<aura-button v-bind="args" size="small" type="tertiary" @click="onClick" />
		<aura-button v-bind="args" size="small" type="success" @click="onClick" />
		<aura-button v-bind="args" size="small" type="warning" @click="onClick" />
		<aura-button v-bind="args" size="small" type="danger" @click="onClick" />
	</div>`,
	methods,
});

export const Primary = AllSizesTemplate.bind({});
Primary.args = {
	type: 'primary',
	label: 'Button',
};

export const Secondary = AllSizesTemplate.bind({});
Secondary.args = {
	type: 'secondary',
	label: 'Button',
};

export const Tertiary = AllSizesTemplate.bind({});
Tertiary.args = {
	type: 'tertiary',
	label: 'Button',
};

export const Success = AllSizesTemplate.bind({});
Success.args = {
	type: 'success',
	label: 'Button',
};

export const Warning = AllSizesTemplate.bind({});
Warning.args = {
	type: 'warning',
	label: 'Button',
};

export const Danger = AllSizesTemplate.bind({});
Danger.args = {
	type: 'danger',
	label: 'Button',
};

export const Outline = AllColorsAndSizesTemplate.bind({});
Outline.args = {
	outline: true,
	label: 'Button',
};

export const Text = AllColorsAndSizesTemplate.bind({});
Text.args = {
	text: true,
	label: 'Button',
};

export const WithIcon = AllSizesTemplate.bind({});
WithIcon.args = {
	label: 'Button',
	icon: 'circle-plus',
};

export const Square = AllColorsAndSizesTemplate.bind({});
Square.args = {
	label: '48',
	square: true,
};
