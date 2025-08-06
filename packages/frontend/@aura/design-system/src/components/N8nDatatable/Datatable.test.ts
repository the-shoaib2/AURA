import { render } from '@testing-library/vue';

import { removeDynamicAttributes } from '@aura/design-system/utils';

import { rows, columns } from './__tests__/data';
import auraDatatable from './Datatable.vue';

const stubs = [
	'aura-option',
	'aura-button',
	// Ideally we'd like to stub auraSelect & auraPagination, but it doesn't work
	// after migrating to setup script:
	// https://github.com/vuejs/vue-test-utils/issues/2048
	// 'aura-select',
	// 'aura-pagination',
];

describe('components', () => {
	describe('auraDatatable', () => {
		const rowsPerPage = 10;

		it('should render correctly', () => {
			const wrapper = render(auraDatatable, {
				props: {
					columns,
					rows,
					rowsPerPage,
				},
				global: {
					stubs,
				},
			});

			expect(wrapper.container.querySelectorAll('thead tr').length).toEqual(1);
			expect(wrapper.container.querySelectorAll('tbody tr').length).toEqual(rowsPerPage);
			expect(wrapper.container.querySelectorAll('tbody tr td').length).toEqual(
				columns.length * rowsPerPage,
			);
			removeDynamicAttributes(wrapper.container);
			expect(wrapper.html()).toMatchSnapshot();
		});

		it('should add column classes', () => {
			const wrapper = render(auraDatatable, {
				props: {
					columns: columns.map((column) => ({ ...column, classes: ['example'] })),
					rows,
					rowsPerPage,
				},
				global: {
					stubs,
				},
			});

			expect(wrapper.container.querySelectorAll('.example').length).toEqual(
				columns.length * (rowsPerPage + 1),
			);
		});

		it('should render row slot', () => {
			const wrapper = render(auraDatatable, {
				props: {
					columns,
					rows,
					rowsPerPage,
				},
				global: {
					stubs,
				},
				slots: {
					row: '<template #row="props"><td v-for="column in props.columns" :key="column.id">Row slot</td></template>', // Wrapper is necessary for looping
				},
			});

			expect(wrapper.container.querySelectorAll('tbody td').length).toEqual(
				columns.length * rowsPerPage,
			);
			expect(wrapper.container.querySelector('tbody td')?.textContent).toEqual('Row slot');
		});

		it('should render all rows when rowsPerPage is set to -1', () => {
			const wrapper = render(auraDatatable, {
				props: { columns, rows, rowsPerPage: -1 },
				global: { stubs },
			});

			const pagination = wrapper.container.querySelector('.pagination');
			expect(pagination?.querySelector('.el-pager')).toBeNull();

			const pageSizeSelector = wrapper.container.querySelector('.pageSizeSelector');
			expect(pageSizeSelector?.textContent).toContain('Page size');

			const allOption = wrapper.getByText('All');
			expect(allOption).not.toBeNull();

			expect(wrapper.container.querySelectorAll('tbody tr').length).toEqual(rows.length);
			expect(wrapper.container.querySelectorAll('tbody tr td').length).toEqual(
				columns.length * rows.length,
			);
		});
	});
});
