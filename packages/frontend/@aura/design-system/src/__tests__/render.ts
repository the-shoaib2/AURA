import { render } from '@testing-library/vue';

import { auraPlugin } from '@aura/design-system/plugin';

type Component = Parameters<typeof render>[0];
type RenderOptions = Parameters<typeof render>[1];

export const createComponentRenderer = (component: Component) => (options: RenderOptions) => {
	const mergedOptions: RenderOptions = {
		...options,
		global: {
			...(options?.global ?? {}),
			stubs: {
				...(options?.global?.stubs ?? {}),
			},
			plugins: [auraPlugin, ...(options?.global?.plugins ?? [])],
		},
	};
	return render(component, mergedOptions);
};
