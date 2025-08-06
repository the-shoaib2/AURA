import { render, screen } from '@testing-library/vue';

import auraAlert from './Alert.vue';

describe('components', () => {
	describe('auraAlert', () => {
		it('should render with props', () => {
			render(auraAlert, {
				props: { title: 'Title', description: 'Message' },
			});
			expect(screen.getByRole('alert')).toBeVisible();
			expect(screen.getByText('Title')).toBeVisible();
			expect(screen.getByText('Message')).toBeVisible();
		});

		it('should render slots instead of props', () => {
			const { container } = render(auraAlert, {
				props: { showIcon: false },
				slots: {
					title: 'Title',
					default: 'Message',
					aside: '<button>Click me</button>',
					icon: '<aura-icon icon="circle-plus" />',
				},
				global: {
					components: {
						'aura-icon': {
							template: '<span class="aura-icon" />',
							props: ['icon'],
						},
					},
				},
			});
			expect(screen.getByRole('alert')).toBeVisible();
			expect(screen.getByText('Title')).toBeVisible();
			expect(screen.getByText('Message')).toBeVisible();
			expect(screen.getByRole('button')).toBeVisible();
			expect(container.querySelector('.aura-icon')).toBeInTheDocument();
		});
	});
});
