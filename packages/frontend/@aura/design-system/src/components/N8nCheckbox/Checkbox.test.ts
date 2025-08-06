import { render } from '@testing-library/vue';

import auraCheckbox from './Checkbox.vue';

describe('components', () => {
	describe('auraCheckbox', () => {
		it('should render without label and child content', () => {
			const { container } = render(auraCheckbox);
			expect(container).toMatchSnapshot();
		});

		it('should render with label', () => {
			const { container } = render(auraCheckbox, { props: { label: 'Checkbox' } });
			expect(container).toMatchSnapshot();
		});

		it('should render with child', () => {
			const { container } = render(auraCheckbox, {
				slots: { default: '<strong>Bold text</strong>' },
			});
			expect(container).toMatchSnapshot();
		});

		it('should render with both child and label', () => {
			const { container } = render(auraCheckbox, {
				props: { label: 'Checkbox' },
				slots: { default: '<strong>Bold text</strong>' },
			});
			expect(container).toMatchSnapshot();
		});
	});
});
