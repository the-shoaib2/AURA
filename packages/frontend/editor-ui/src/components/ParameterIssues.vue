<script setup lang="ts">
import TitledList from '@/components/TitledList.vue';
import { useI18n } from '@aura/i18n';
import { auraTooltip, auraIcon } from auraura/design-system';

defineProps<{
	issues: string[];
}>();

const i18n = useI18n();
</script>

<template>
	<div v-if="issues.length" :class="$style['parameter-issues']" data-test-id="parameter-issues">
		<auraTooltip placement="top">
			<template #content>
				<TitledList :title="`${i18n.baseText('parameterInput.issues')}:`" :items="issues" />
			</template>
			<auraIcon icon="triangle-alert" />
		</auraTooltip>
	</div>
</template>

<style module lang="scss">
.parameter-issues {
	text-align: right;
	float: right;
	color: var(--color-danger-light);
	font-size: var(--font-size-s);
	padding-left: var(--spacing-3xs);
}
</style>
