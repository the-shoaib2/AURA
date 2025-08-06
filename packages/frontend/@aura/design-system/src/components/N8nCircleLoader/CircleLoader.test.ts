import { render } from '@testing-library/vue';

import auraCircleLoader from './CircleLoader.vue';

describe('auraCircleLoader', () => {
	it('should render correctly', () => {
		const wrapper = render(auraCircleLoader, {
			props: {
				radius: 20,
				progress: 42,
				strokeWidth: 10,
			},
		});
		expect(wrapper.html()).toMatchSnapshot();
	});
});
