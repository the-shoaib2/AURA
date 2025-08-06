<script setup lang="ts">
import { useI18n } from '@aura/i18n';
import { auraText } from 'aurara/design-system';

const {
	dataCount,
	unfilteredDataCount,
	subExecutionsCount = 0,
	search,
} = defineProps<{
	dataCount: number;
	unfilteredDataCount: number;
	subExecutionsCount?: number;
	search: string;
}>();

const i18n = useI18n();
</script>

<template>
	<auraText v-if="search" :class="$style.itemsText">
		{{
			i18n.baseText('ndv.search.items', {
				adjustToNumber: unfilteredDataCount,
				interpolate: { matched: dataCount, count: unfilteredDataCount },
			})
		}}
	</auraText>
	<auraText v-else :class="$style.itemsText">
		<span>
			{{
				i18n.baseText('ndv.output.items', {
					adjustToNumber: dataCount,
					interpolate: { count: dataCount },
				})
			}}
		</span>
		<span v-if="subExecutionsCount > 0">
			{{
				i18n.baseText('ndv.output.andSubExecutions', {
					adjustToNumber: subExecutionsCount,
					interpolate: { count: subExecutionsCount },
				})
			}}
		</span>
	</auraText>
</template>

<style lang="scss" module>
.itemsText {
	flex-shrink: 0;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	color: var(--color-text-light);
	font-size: var(--font-size-2xs);
}
</style>
