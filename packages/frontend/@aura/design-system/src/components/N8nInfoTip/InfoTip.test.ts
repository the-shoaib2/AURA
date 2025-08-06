import { render } from '@testing-library/vue';

import auraInfoTip from './InfoTip.vue';

const slots = {
	default: ['Need help doing something?', '<a href="/docs" target="_blank">Open docs</a>'],
};
const stubs = ['aura-tooltip', 'aura-icon'];

describe('auraInfoTip', () => {
	it('should render correctly as note', () => {
		const wrapper = render(auraInfoTip, {
			slots,
			global: {
				stubs,
			},
		});
		expect(wrapper.html()).toMatchSnapshot();
	});

	it('should render correctly as tooltip', () => {
		const wrapper = render(auraInfoTip, {
			slots,
			props: {
				type: 'tooltip',
			},
			global: {
				stubs,
			},
		});
		expect(wrapper.html()).toMatchSnapshot();
	});

	it('should render correctly with a specific size', () => {
		const wrapper = render(auraInfoTip, {
			slots,
			props: {
				size: 'large',
			},
			global: {
				stubs,
			},
		});
		expect(wrapper.html()).toMatchSnapshot();
	});
});
