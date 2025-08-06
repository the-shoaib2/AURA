import { render } from '@testing-library/vue';

import { auraText } from '@aura/design-system/components';
import { auraHtml } from '@aura/design-system/directives';

import auraNotice from './Notice.vue';

describe('components', () => {
	describe('auraNotice', () => {
		it('should render correctly', () => {
			const wrapper = render(auraNotice, {
				props: {
					id: 'notice',
				},
				slots: {
					default: 'This is a notice.',
				},
				global: {
					stubs: ['aura-text'],
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});

		describe('props', () => {
			describe('content', () => {
				it('should render correctly with content prop', () => {
					const wrapper = render(auraNotice, {
						props: {
							id: 'notice',
							content: 'This is a notice.',
						},
						global: {
							stubs: ['aura-text'],
						},
					});
					expect(wrapper.html()).toMatchSnapshot();
				});

				it('should render HTML', () => {
					const wrapper = render(auraNotice, {
						props: {
							id: 'notice',
							content: '<strong>Hello world!</strong> This is a notice.',
						},
						global: {
							directives: {
								auraHtml,
							},
							components: {
								'aura-text': auraText,
							},
						},
					});

					expect(wrapper.container.querySelectorAll('strong')).toHaveLength(1);
					expect(wrapper.html()).toMatchSnapshot();
				});

				it('should sanitize rendered HTML', () => {
					const wrapper = render(auraNotice, {
						props: {
							id: 'notice',
							content: '<script>alert(1);</script> This is a notice.',
						},
						global: {
							stubs: ['aura-text'],
						},
					});

					expect(wrapper.container.querySelector('script')).not.toBeTruthy();
					expect(wrapper.html()).toMatchSnapshot();
				});
			});
		});
	});
});
