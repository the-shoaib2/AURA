import type { StoryFn } from '@storybook/vue3';

import { rows, columns } from './__tests__/data';
import auraDatatable from './Datatable.vue';

export default {
	title: 'Atoms/Datatable',
	component: auraDatatable,
};

export const Default: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		auraDatatable,
	},
	template: '<aura-datatable v-bind="args"></aura-datatable>',
});

Default.args = {
	columns,
	rows,
};
