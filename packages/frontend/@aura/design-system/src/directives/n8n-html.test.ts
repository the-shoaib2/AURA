import { render } from '@testing-library/vue';

import { auraHtml } from './aura-html';

const TestComponent = {
	props: {
		html: {
			type: String,
		},
	},
	template: '<div v-aura-html="html"></div>',
};

describe('Directive aura-html', () => {
	it('should sanitize html', async () => {
		const { html } = render(TestComponent, {
			props: {
				html: '<span>text</span><a href="https://malicious.com" onclick="alert(1)">malicious</a><img alt="Ok" src="./images/logo.svg" onerror="alert(2)" /><script>alert(3)</script>',
			},
			global: {
				directives: {
					auraHtml,
				},
			},
		});
		expect(html()).toBe(
			'<div><span>text</span><a href="https://malicious.com">malicious</a><img alt="Ok" src="./images/logo.svg"></div>',
		);
	});

	it('should not touch safe html', async () => {
		const { html } = render(TestComponent, {
			props: {
				html: '<span>text</span><a href="https://safe.com">safe</a><img alt="Ok" src="./images/logo.svg" />',
			},
			global: {
				directives: {
					auraHtml,
				},
			},
		});
		expect(html()).toBe(
			'<div><span>text</span><a href="https://safe.com">safe</a><img alt="Ok" src="./images/logo.svg"></div>',
		);
	});
});
