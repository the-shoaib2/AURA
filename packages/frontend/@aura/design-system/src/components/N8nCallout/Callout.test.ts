import { render } from '@testing-library/vue';

import auraCallout from './Callout.vue';

describe('components', () => {
	describe('auraCallout', () => {
		it('should render info theme correctly', () => {
			const wrapper = render(auraCallout, {
				props: {
					theme: 'info',
				},
				global: {
					stubs: ['aura-icon', 'aura-text'],
				},
				slots: {
					default: '<aura-text size="small">This is an info callout.</aura-text>',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
		it('should render success theme correctly', () => {
			const wrapper = render(auraCallout, {
				props: {
					theme: 'success',
				},
				global: {
					stubs: ['aura-icon', 'aura-text'],
				},
				slots: {
					default: '<aura-text size="small">This is a success callout.</aura-text>',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
		it('should render warning theme correctly', () => {
			const wrapper = render(auraCallout, {
				props: {
					theme: 'warning',
				},
				global: {
					stubs: ['aura-icon', 'aura-text'],
				},
				slots: {
					default: '<aura-text size="small">This is a warning callout.</aura-text>',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
		it('should render danger theme correctly', () => {
			const wrapper = render(auraCallout, {
				props: {
					theme: 'danger',
				},
				global: {
					stubs: ['aura-icon', 'aura-text'],
				},
				slots: {
					default: '<aura-text size="small">This is a danger callout.</aura-text>',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
		it('should render secondary theme correctly', () => {
			const wrapper = render(auraCallout, {
				props: {
					theme: 'secondary',
				},
				global: {
					stubs: ['aura-icon', 'aura-text'],
				},
				slots: {
					default: '<aura-text size="small">This is a secondary callout.</aura-text>',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
		it('should render custom theme correctly', () => {
			const wrapper = render(auraCallout, {
				props: {
					theme: 'custom',
					icon: 'git-branch',
				},
				global: {
					stubs: ['aura-icon', 'aura-text'],
				},
				slots: {
					default: '<aura-text size="small">This is a secondary callout.</aura-text>',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
		it('should render additional slots correctly', () => {
			const wrapper = render(auraCallout, {
				props: {
					theme: 'custom',
					icon: 'git-branch',
				},
				global: {
					stubs: ['aura-icon', 'aura-text', 'aura-link'],
				},
				slots: {
					default: '<aura-text size="small">This is a secondary callout.</aura-text>',
					actions: '<aura-link size="small">Do something!</aura-link>',
					trailingContent:
						'<aura-link theme="secondary" size="small" :bold="true" :underline="true" to="https://aura.io">Learn more</aura-link>',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
	});
});
