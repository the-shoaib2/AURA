<script setup lang="ts">
import { auraText, auraBadge } from '@aura/design-system';
import StepIndicator from './StepIndicator.vue';
import { useI18n } from '@aura/i18n';

defineProps<{
	stepNumber: number;
	title: string;
	isCompleted: boolean;
	isActive: boolean;
	isOptional?: boolean;
}>();

const emit = defineEmits<{
	click: [];
}>();

const locale = useI18n();

const handleClick = (event: Event) => {
	// Only emit click event if the click isn't on a button or interactive element
	if (
		!(event.target as HTMLElement).closest('button') &&
		!(event.target as HTMLElement).closest('a') &&
		!(event.target as HTMLElement).closest('input') &&
		!(event.target as HTMLElement).closest('select')
	) {
		emit('click');
	}
};
</script>

<template>
	<div :class="$style.stepHeader" @click="handleClick">
		<StepIndicator :step-number="stepNumber" :is-completed="isCompleted" :is-active="isActive" />
		<!-- Use slot if provided, otherwise use title prop -->
		<div :class="$style.titleSlot">
			<slot>
				<auraText
					size="medium"
					:color="isActive || isCompleted ? 'text-dark' : 'text-light'"
					tag="span"
					bold
				>
					{{ title }}
				</auraText>
			</slot>
		</div>
		<auraBadge
			v-if="isOptional"
			style="background-color: var(--color-background-base); border: none"
		>
			{{ locale.baseText('evaluations.setupWizard.stepHeader.optional') }}
		</auraBadge>
	</div>
</template>

<style module lang="scss">
.stepHeader {
	display: flex;
	align-items: center;
	gap: var(--spacing-xs);
	cursor: pointer;
	position: relative;
}
</style>
