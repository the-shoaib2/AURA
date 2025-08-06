import { render } from '@testing-library/vue';

import auraActionBox from './ActionBox.vue';

describe('auraActionBox', () => {
	it('should render correctly', () => {
		const wrapper = render(auraActionBox, {
			props: {
				emoji: '😿',
				heading: 'Headline you need to know',
				description:
					'Long description that you should know something is the way it is because of how it is. ',
				buttonText: 'Do something',
				buttonType: 'primary',
			},
			global: {
				stubs: ['aura-heading', 'aura-text', 'aura-button', 'aura-callout'],
			},
		});
		expect(wrapper.html()).toMatchSnapshot();
	});
});
