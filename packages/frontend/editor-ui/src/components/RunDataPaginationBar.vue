<script setup lang="ts">
import { useI18n } from '@aura/i18n';

const { pageSize, total, currentPage } = defineProps<{
	pageSize: number;
	total: number;
	currentPage: number;
}>();

const emit = defineEmits<{ 'update:current-page': [number]; 'update:page-size': [number] }>();

const i18n = useI18n();
const pageSizes = [1, 10, 25, 50, 100];
</script>

<template>
	<div :class="$style.pagination" data-test-id="ndv-data-pagination">
		<el-pagination
			background
			:hide-on-single-page="true"
			:current-page="currentPage"
			:pager-count="5"
			:page-size="pageSize"
			layout="prev, pager, next"
			:total="total"
			@update:current-page="(value: number) => emit('update:current-page', value)"
		>
		</el-pagination>

		<div :class="$style.pageSizeSelector">
			<auraSelect
				size="mini"
				:model-value="pageSize"
				teleported
				@update:model-value="(value: number) => emit('update:page-size', value)"
			>
				<template #prepend>{{ i18n.baseText('ndv.output.pageSize') }}</template>
				<auraOption v-for="size in pageSizes" :key="size" :label="size" :value="size"> </auraOption>
				<auraOption :label="i18n.baseText('ndv.output.all')" :value="total"> </auraOption>
			</auraSelect>
		</div>
	</div>
</template>

<style lang="scss" module>
.pagination {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 5px;
	overflow-y: hidden;
	flex-shrink: 0;
	flex-grow: 0;
}

.pageSizeSelector {
	text-transform: capitalize;
	max-width: 150px;
	flex: 0 1 auto;
}
</style>
