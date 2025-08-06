<script lang="ts" setup="">
import type { ExecutionStatus } from 'aura-workflow';
import { useI18n } from '@aura/i18n';
import { I18nT } from 'vue-i18n';

const props = defineProps<{
	status: ExecutionStatus;
	concurrencyCap: number;
	isCloudDeployment?: boolean;
}>();

const emit = defineEmits<{
	goToUpgrade: [];
}>();

const i18n = useI18n();
</script>

<template>
	<auraTooltip placement="top">
		<template #content>
			<I18nT
				v-if="props.status === 'waiting'"
				keypath="executionsList.statusTooltipText.theWorkflowIsWaitingIndefinitely"
				scope="global"
			/>
			<I18nT
				v-if="props.status === 'new'"
				keypath="executionsList.statusTooltipText.waitingForConcurrencyCapacity"
				scope="global"
			>
				<template #instance>
					<I18nT
						v-if="props.isCloudDeployment"
						keypath="executionsList.statusTooltipText.waitingForConcurrencyCapacity.cloud"
						scope="global"
					>
						<template #concurrencyCap>{{ props.concurrencyCap }}</template>
						<template #link>
							<auraLink bold size="small" :class="$style.link" @click="emit('goToUpgrade')">
								{{ i18n.baseText('generic.upgradeNow') }}
							</auraLink>
						</template>
					</I18nT>
					<I18nT
						v-else
						keypath="executionsList.statusTooltipText.waitingForConcurrencyCapacity.self"
						scope="global"
					>
						<template #concurrencyCap>{{ props.concurrencyCap }}</template>
						<template #link>
							<auraLink
								:class="$style.link"
								:href="i18n.baseText('executions.concurrency.docsLink')"
								target="_blank"
								>{{ i18n.baseText('generic.viewDocs') }}</auraLink
							>
						</template>
					</I18nT>
				</template>
			</I18nT>
		</template>
		<slot />
	</auraTooltip>
</template>

<style lang="scss" module>
.link {
	display: inline-block;
	margin-top: var(--spacing-xs);
}
</style>
