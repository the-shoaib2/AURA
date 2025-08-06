import { render } from '@testing-library/vue';

import auraButton from './Button.vue';

const slots = {
	default: 'Button',
};
const stubs = ['aura-spinner', 'aura-icon'];

describe('components', () => {
	describe('auraButton', () => {
		it('should render correctly', () => {
			const wrapper = render(auraButton, {
				slots,
				global: {
					stubs,
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});

		describe('props', () => {
			describe('loading', () => {
				it('should render loading spinner', () => {
					const wrapper = render(auraButton, {
						props: {
							loading: true,
						},
						slots,
						global: {
							stubs,
						},
					});
					expect(wrapper.html()).toMatchSnapshot();
				});
			});

			describe('icon', () => {
				it('should render icon button', () => {
					const wrapper = render(auraButton, {
						props: {
							icon: 'circle-plus',
						},
						slots,
						global: {
							stubs,
						},
					});
					expect(wrapper.html()).toMatchSnapshot();
				});
			});

			describe('square', () => {
				it('should render square button', () => {
					const wrapper = render(auraButton, {
						props: {
							square: true,
							label: '48',
						},
						global: {
							stubs,
						},
					});
					expect(wrapper.html()).toMatchSnapshot();
				});
			});
		});
	});
});
