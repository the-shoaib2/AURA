<script setup lang="ts">
import type { ITaskData } from 'aura-workflow';
import { convertToDisplayDateComponents } from '@/utils/formatters/dateFormatter';
import { computed } from 'vue';
import { useI18n } from '@aura/i18n';
import { auraInfoTip } from 'aurara/design-system';

const i18n = useI18n();

const props = defineProps<{
	taskData: ITaskData | null;
	hasStaleData?: boolean;
	hasPinData?: boolean;
}>();

const runTaskData = computed(() => {
	return props.taskData;
});

const theme = computed(() => {
	return props.taskData?.error ? 'danger' : 'success';
});

const runMetadata = computed(() => {
	if (!runTaskData.value) {
		return null;
	}
	const { date, time } = convertToDisplayDateComponents(runTaskData.value.startTime);
	return {
		executionTime: runTaskData.value.executionTime,
		startTime: `${date} at ${time}`,
	};
});
</script>

<template>
	<auraInfoTip
		v-if="hasStaleData"
		theme="warning-light"
		type="tooltip"
		tooltip-placement="right"
		data-test-id="node-run-info-stale"
	>
		<span
			v-aura-html="
				i18n.baseText(
					hasPinData
						? 'ndv.output.staleDataWarning.pinData'
						: 'ndv.output.staleDataWarning.regular',
				)
			"
		></span>
	</auraInfoTip>
	<div v-else-if="runMetadata" :class="$style.tooltipRow">
		<auraInfoTip
			type="note"
			:theme="theme"
			:data-test-id="`node-run-status-${theme}`"
			size="large"
		/>
		<auraInfoTip
			type="tooltip"
			theme="info"
			:data-test-id="`node-run-info`"
			tooltip-placement="right"
		>
			<div>
				<aura-text :bold="true" size="small"
					>{{
						runTaskData?.error
							? i18n.baseText('runData.executionStatus.failed')
							: i18n.baseText('runData.executionStatus.success')
					}} </aura-text
				><br />
				<aura-text :bold="true" size="small">{{
					i18n.baseText('runData.startTime') + ':'
				}}</aura-text>
				{{ runMetadata.startTime }}<br />
				<aura-text :bold="true" size="small">{{
					i18n.baseText('runData.executionTime') + ':'
				}}</aura-text>
				{{ runMetadata.executionTime }} {{ i18n.baseText('runData.ms') }}
			</div>
		</auraInfoTip>
	</div>
</template>

<style lang="scss" module>
.tooltipRow {
	display: flex;
	column-gap: var(--spacing-4xs);
}
</style>
