import { render } from '@testing-library/vue';

import auraRoute from './Route.vue';

describe('auraRoute', () => {
	it('should render internal router links', () => {
		const wrapper = render(auraRoute, {
			props: {
				to: '/test',
			},
			global: {
				stubs: ['RouterLink'],
			},
		});
		expect(wrapper.html()).toMatchSnapshot();
	});

	it('should render internal links with newWindow=true', () => {
		const wrapper = render(auraRoute, {
			props: {
				to: '/test',
				newWindow: true,
			},
			global: {
				stubs: ['RouterLink'],
			},
		});
		expect(wrapper.html()).toMatchSnapshot();
	});

	it('should render external links', () => {
		const wrapper = render(auraRoute, {
			props: {
				to: 'https://example.com/',
			},
			global: {
				stubs: ['RouterLink'],
			},
		});
		expect(wrapper.html()).toMatchSnapshot();
	});
});
