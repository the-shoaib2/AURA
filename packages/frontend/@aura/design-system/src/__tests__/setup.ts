import '@testing-library/jest-dom';
import { configure } from '@testing-library/vue';
import { config } from '@vue/test-utils';
import ElementPlus from 'element-plus';

import { auraPlugin } from '@aura/design-system/plugin';

configure({ testIdAttribute: 'data-test-id' });

config.global.plugins = [auraPlugin, ElementPlus];

window.ResizeObserver =
	window.ResizeObserver ||
	vi.fn().mockImplementation(() => ({
		disconnect: vi.fn(),
		observe: vi.fn(),
		unobserve: vi.fn(),
	}));

// Globally mock is-emoji-supported
vi.mock('is-emoji-supported', () => ({
	isEmojiSupported: () => true,
}));
