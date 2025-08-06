import { render } from '@testing-library/vue';

import auraInput from './Input.vue';

describe('auraInput', () => {
	it('should render correctly', () => {
		const wrapper = render(auraInput, {
			props: {
				name: 'input',
			},
		});
		expect(wrapper.html()).toMatchSnapshot();
	});

	it('should add .ph-no-capture class on password input', () => {
		const { container } = render(auraInput, {
			props: {
				type: 'password',
			},
		});
		expect(container.firstChild).toHaveClass('ph-no-capture');
	});

	it('should not add .ph-no-capture class on other input types', () => {
		const { container } = render(auraInput, {
			props: {
				type: 'number',
			},
		});
		expect(container.firstChild).not.toHaveClass('ph-no-capture');
	});
});
