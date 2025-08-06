<script setup lang="ts">
import { useAttrs } from 'vue';
import { type IconName } from '@aura/design-system/src/components/auraIcon/icons';

defineProps<{ label: string; icon: IconName; placement: 'left' | 'right' | 'top' | 'bottom' }>();

const attrs = useAttrs();

const onClick = () => {
	// @ts-expect-error Attrs onClick is not typed
	attrs.onClick?.();
};
</script>

<template>
	<div :class="$style.container">
		<aura-tooltip :placement="placement">
			<template #content>
				{{ label }}
			</template>
			<aura-icon :class="$style.icon" :icon="icon" size="xsmall" @click="onClick" />
		</aura-tooltip>
	</div>
</template>

<style lang="scss" module>
.container {
	display: inline-flex;
	align-items: center;
	margin: 0 var(--spacing-4xs);
}

.icon {
	color: var(--color-foreground-dark);
	cursor: pointer;

	&:hover {
		color: var(--color-primary);
	}
}
</style>
