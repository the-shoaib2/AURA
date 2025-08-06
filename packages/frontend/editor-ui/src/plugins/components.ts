import type { Plugin } from 'vue';

import 'regenerator-runtime/runtime';

import ElementPlus, { ElLoading, ElMessageBox } from 'element-plus';
import { auraPlugin } from '@aura/design-system';
import { useMessage } from '@/composables/useMessage';
import EnterpriseEdition from '@/components/EnterpriseEdition.ee.vue';
import ParameterInputList from '@/components/ParameterInputList.vue';

export const GlobalComponentsPlugin: Plugin = {
	install(app) {
		const messageService = useMessage();

		app.component('EnterpriseEdition', EnterpriseEdition);
		app.component('ParameterInputList', ParameterInputList);

		app.use(ElementPlus);
		app.use(auraPlugin, {});

		// app.use(ElLoading);
		// app.use(ElNotification);

		app.config.globalProperties.$loading = ElLoading.service;
		app.config.globalProperties.$msgbox = ElMessageBox;
		app.config.globalProperties.$alert = messageService.alert;
		app.config.globalProperties.$confirm = messageService.confirm;
		app.config.globalProperties.$prompt = messageService.prompt;
		app.config.globalProperties.$message = messageService.message;
	},
};
