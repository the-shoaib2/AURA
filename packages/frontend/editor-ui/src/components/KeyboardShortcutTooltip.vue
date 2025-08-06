<script setup lang="ts">
import type { KeyboardShortcut } from '@/Interface';
import { auraKeyboardShortcut, auraTooltip } from '@aura/design-system';
import type { Placement } from 'element-plus';

interface Props {
	label: string;
	shortcut?: KeyboardShortcut;
	placement?: Placement;
	disabled?: boolean;
}
withDefaults(defineProps<Props>(), { placement: 'top', shortcut: undefined });
</script>

<template>
	<auraTooltip :placement="placement" :show-after="500" :disabled>
		<template #content>
			<div :class="$style.shortcut">
				<div :class="$style.label">{{ label }}</div>
				<auraKeyboardShortcut v-if="shortcut" v-bind="shortcut" />
			</div>
		</template>
		<slot />
	</auraTooltip>
</template>

<style lang="scss" module>
.shortcut {
	display: flex;
	align-items: center;
	font-size: var(--font-size-2xs);
	gap: var(--spacing-2xs);
}

.label {
	flex-shrink: 0;
}
</style>
