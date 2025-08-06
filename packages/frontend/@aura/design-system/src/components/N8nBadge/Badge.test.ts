import { render } from '@testing-library/vue';

import auraBadge from './Badge.vue';

describe('components', () => {
	describe('auraBadge', () => {
		describe('props', () => {
			it('should render default theme correctly', () => {
				const wrapper = render(auraBadge, {
					props: {
						theme: 'default',
						size: 'large',
						bold: true,
					},
					slots: {
						default: '<aura-text>Default badge</aura-text>',
					},
					global: {
						stubs: ['aura-text'],
					},
				});
				expect(wrapper.html()).toMatchSnapshot();
			});
			it('should render secondary theme correctly', () => {
				const wrapper = render(auraBadge, {
					props: {
						theme: 'secondary',
						size: 'medium',
						bold: false,
					},
					slots: {
						default: '<aura-text>Secondary badge</aura-text>',
					},
					global: {
						stubs: ['aura-text'],
					},
				});
				expect(wrapper.html()).toMatchSnapshot();
			});
			it('should render with default values correctly', () => {
				const wrapper = render(auraBadge, {
					slots: {
						default: '<aura-text>A Badge</aura-text>',
					},
					global: {
						stubs: ['aura-text'],
					},
				});
				expect(wrapper.html()).toMatchSnapshot();
			});
		});
	});
});
