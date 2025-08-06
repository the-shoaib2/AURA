import { render } from '@testing-library/vue';

import auraCard from './Card.vue';

describe('components', () => {
	describe('auraCard', () => {
		it('should render correctly', () => {
			const wrapper = render(auraCard, {
				slots: {
					default: 'This is a card.',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});

		it('should render correctly with header and footer', () => {
			const wrapper = render(auraCard, {
				slots: {
					header: 'Header',
					default: 'This is a card.',
					footer: 'Footer',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
	});
});
