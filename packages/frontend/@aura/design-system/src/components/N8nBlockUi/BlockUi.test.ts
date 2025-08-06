import { render, screen } from '@testing-library/vue';

import auraBlockUi from './BlockUi.vue';

describe('components', () => {
	describe('auraBlockUi', () => {
		it('should render but not visible', () => {
			render(auraBlockUi);
			expect(screen.queryByRole('dialog', { hidden: true })).not.toBeVisible();
		});

		it('should render and is visible', () => {
			render(auraBlockUi, { props: { show: true } });
			expect(screen.getByRole('dialog', { hidden: true })).toBeVisible();
		});
	});
});
