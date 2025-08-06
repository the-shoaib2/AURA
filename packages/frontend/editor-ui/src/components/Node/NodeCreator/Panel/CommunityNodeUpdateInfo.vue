<script setup lang="ts">
import { auraNotice } from '@aura/design-system';
import { i18n } from '@aura/i18n';
import { useUIStore } from '@/stores/ui.store';
import { computed } from 'vue';
const noticeStyles = computed(() => {
	const isDark = useUIStore().appliedTheme === 'dark';
	if (isDark) {
		return {
			borderColor: 'var(--color-callout-secondary-border)',
			backgroundColor: 'var(--color-callout-secondary-background)',
			color: 'var(--color-callout-secondary-font)',
		};
	}
	return {
		borderColor: 'var(--color-secondary)',
		backgroundColor: 'var(--color-secondary-tint-3)',
	};
});
</script>

<template>
	<auraNotice
		theme="info"
		:style="{
			marginTop: '0',
			...noticeStyles,
		}"
	>
		{{ i18n.baseText('communityNodeUpdateInfo.available') }}
	</auraNotice>
</template>

<style lang="scss" module></style>
