import { render } from '@testing-library/vue';

import auraTree from './Tree.vue';

describe('components', () => {
	describe('auraTree', () => {
		it('should render simple tree', () => {
			const wrapper = render(auraTree, {
				props: {
					value: {
						hello: 'world',
					},
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});

		it('should render tree', () => {
			const wrapper = render(auraTree, {
				props: {
					value: {
						hello: {
							test: 'world',
						},
						options: ['yes', 'no'],
					},
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});

		it('should render tree with slots', () => {
			const wrapper = render(auraTree, {
				props: {
					value: {
						hello: {
							test: 'world',
						},
						options: ['yes', 'no'],
					},
				},
				slots: {
					label: '<span>label</span>',
					value: '<span>value</span>',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});

		it('should render each tree with node class', () => {
			const wrapper = render(auraTree, {
				props: {
					value: {
						hello: {
							test: 'world',
						},
						options: ['yes', 'no'],
					},
					nodeClass: 'nodeClass',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
	});
});
