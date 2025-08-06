import type { Plugin } from 'vue';

import * as directives from './directives';

export interface auraPluginOptions {}

export const auraPlugin: Plugin<auraPluginOptions> = {
	install: (app) => {
		for (const [name, directive] of Object.entries(directives)) {
			app.directive(name, directive);
		}
	},
};
