<script setup lang="ts">
import RunData from '@/components/RunData.vue';
import { type LogEntry } from '@/features/logs/logs.types';
import { useI18n } from '@aura/i18n';
import { type IRunDataDisplayMode, type NodePanelType } from '@/Interface';
import { useNDVStore } from '@/stores/ndv.store';
import { waitingNodeTooltip } from '@/utils/executionUtils';
import { auraLink, auraText } from auraura/design-system';
import { computed, inject, ref } from 'vue';
import { I18nT } from 'vue-i18n';
import { PiPWindowSymbol } from '@/constants';
import { isSubNodeLog } from '../logs.utils';

const { title, logEntry, paneType, collapsingTableColumnName } = defineProps<{
	title: string;
	paneType: NodePanelType;
	logEntry: LogEntry;
	collapsingTableColumnName: string | null;
}>();

const emit = defineEmits<{
	collapsingTableColumnChanged: [columnName: string | null];
}>();

const locale = useI18n();
const ndvStore = useNDVStore();

const pipWindow = inject(PiPWindowSymbol, ref<Window | undefined>());

const displayMode = ref<IRunDataDisplayMode>(paneType === 'input' ? 'schema' : 'table');
const isMultipleInput = computed(
	() => paneType === 'input' && (logEntry.runData?.source.length ?? 0) > 1,
);
const runDataProps = computed<
	Pick<InstanceType<typeof RunData>['$props'], 'node' | 'runIndex' | 'overrideOutputs'> | undefined
>(() => {
	if (isSubNodeLog(logEntry) || paneType === 'output') {
		return { node: logEntry.node, runIndex: logEntry.runIndex };
	}

	const source = logEntry.runData?.source[0];
	const node = source && logEntry.workflow.getNode(source.previousNode);

	if (!source || !node) {
		return undefined;
	}

	return {
		node: {
			...node,
			disabled: false, // For RunData component to render data from disabled nodes as well
		},
		runIndex: source.previousNodeRun ?? 0,
		overrideOutputs: [source.previousNodeOutput ?? 0],
	};
});
const isExecuting = computed(
	() =>
		paneType === 'output' &&
		(logEntry.runData?.executionStatus === 'running' ||
			logEntry.runData?.executionStatus === 'waiting'),
);

function handleClickOpenNdv() {
	ndvStore.setActiveNodeName(logEntry.node.name);
}

function handleChangeDisplayMode(value: IRunDataDisplayMode) {
	displayMode.value = value;
}
</script>

<template>
	<RunData
		v-if="runDataProps"
		v-bind="runDataProps"
		:key="`run-data${pipWindow ? '-pip' : ''}`"
		:class="$style.component"
		:workflow="logEntry.workflow"
		:workflow-execution="logEntry.execution"
		:too-much-data-title="locale.baseText('ndv.output.tooMuchData.title')"
		:no-data-in-branch-message="locale.baseText('ndv.output.noOutputDataInBranch')"
		:executing-message="locale.baseText('ndv.output.executing')"
		:pane-type="paneType"
		:disable-run-index-selection="true"
		:compact="true"
		:disable-pin="true"
		:disable-edit="true"
		:disable-hover-highlight="true"
		:disable-settings-hint="true"
		:display-mode="displayMode"
		:disable-ai-content="!isSubNodeLog(logEntry)"
		:is-executing="isExecuting"
		table-header-bg-color="light"
		:collapsing-table-column-name="collapsingTableColumnName"
		@display-mode-change="handleChangeDisplayMode"
		@collapsing-table-column-changed="emit('collapsingTableColumnChanged', $event)"
	>
		<template #header>
			<auraText :class="$style.title" :bold="true" color="text-light" size="small">
				{{ title }}
			</auraText>
		</template>

		<template #no-output-data>
			<auraText :bold="true" color="text-dark" size="large">
				{{ locale.baseText('ndv.output.noOutputData.title') }}
			</auraText>
		</template>

		<template #node-waiting>
			<auraText :bold="true" color="text-dark" size="large">
				{{ locale.baseText('ndv.output.waitNodeWaiting.title') }}
			</auraText>
			<auraText vaurara-html="waitingNodeTooltip(logEntry.node)"></auraText>
		</template>

		<template v-if="isMultipleInput" #content>
			<!-- leave empty -->
		</template>

		<template v-if="isMultipleInput" #callout-message>
			<I18nT keypath="logs.details.body.multipleInputs" scope="global">
				<template #button>
					<auraLink size="small" @click="handleClickOpenNdv">
						{{ locale.baseText('logs.details.body.multipleInputs.openingTheNode') }}
					</auraLink>
				</template>
			</I18nT>
		</template>
	</RunData>
</template>

<style lang="scss" module>
.component {
	--color-run-data-background: var(--color-background-light);
}

.title {
	text-transform: uppercase;
	letter-spacing: 3px;
}
</style>
