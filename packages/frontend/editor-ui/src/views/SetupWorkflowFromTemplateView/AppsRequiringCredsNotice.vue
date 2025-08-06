<script setup lang="ts">
import { computed } from 'vue';
import auraNotice from '@aura/design-system/components/auraNotice';
import { formatList } from '@/utils/formatters/listFormatter';
import { useI18n } from '@aura/i18n';
import type {
	AppCredentials,
	BaseNode,
} from '@/views/SetupWorkflowFromTemplateView/useCredentialSetupState';
import { I18nT } from 'vue-i18n';

const i18n = useI18n();

const props = defineProps<{
	appCredentials: Array<AppCredentials<BaseNode>>;
}>();

const formatApp = (app: AppCredentials<BaseNode>) =>
	`<b>${app.credentials.length}x ${app.appName}</b>`;

const appNodeCounts = computed(() => {
	return formatList(props.appCredentials, {
		formatFn: formatApp,
		i18n,
	});
});
</script>

<template>
	<auraNotice :class="$style.notice" theme="info">
		<I18nT tag="span" keypath="templateSetup.instructions" scope="global">
			<span v-aura-html="appNodeCounts" />
		</I18nT>
	</auraNotice>
</template>

<style lang="scss" module>
.notice {
	margin-top: 0;
}
</style>
