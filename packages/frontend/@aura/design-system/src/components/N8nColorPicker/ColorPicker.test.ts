import { render } from '@testing-library/vue';

import auraColorPicker from './ColorPicker.vue';

describe('components', () => {
	describe('auraColorPicker', () => {
		it('should render with input', () => {
			const { container } = render(auraColorPicker, {
				props: {
					name: 'color-picker',
				},
			});
			expect(container).toMatchSnapshot();
		});

		it('should render without input', () => {
			const { container } = render(auraColorPicker, {
				props: {
					name: 'color-picker',
					showInput: false,
				},
			});
			expect(container).toMatchSnapshot();
		});
	});
});
