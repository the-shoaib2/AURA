<script lang="ts" setup>
import { useI18n } from '@aura/i18n';

const emit = defineEmits<{
	'update:modelValue': [feedback: 'positive' | 'negative'];
}>();

defineProps<{
	modelValue?: 'positive' | 'negative';
}>();

const i18n = useI18n();

function onFeedback(feedback: 'positive' | 'negative') {
	emit('update:modelValue', feedback);
}
</script>
<template>
	<div class="feedback">
		<auraText v-if="!modelValue" class="mr-2xs">
			{{ i18n.baseText('feedback.title') }}
		</auraText>
		<auraText v-else :color="modelValue === 'positive' ? 'success' : 'danger'">
			<auraIcon :icon="modelValue === 'positive' ? 'thumbs-up' : 'thumbs-down'" class="mr-2xs" />
			{{ i18n.baseText(`feedback.${modelValue}`) }}
		</auraText>
		<auraTooltip v-if="!modelValue" :content="i18n.baseText('feedback.positive')">
			<span
				class="feedback-button"
				data-test-id="feedback-button-positive"
				@click="onFeedback('positive')"
			>
				<auraIcon icon="thumbs-up" />
			</span>
		</auraTooltip>
		<auraTooltip v-if="!modelValue" :content="i18n.baseText('feedback.negative')">
			<span
				class="feedback-button"
				data-test-id="feedback-button-negative"
				@click="onFeedback('negative')"
			>
				<auraIcon icon="thumbs-down" />
			</span>
		</auraTooltip>
	</div>
</template>

<style lang="scss">
.feedback {
	display: flex;
	align-items: center;
	gap: var(--spacing-4xs);

	.feedback-button {
		cursor: pointer;
		width: var(--spacing-l);
		height: var(--spacing-l);
		color: var(--color-text-light);
		display: flex;
		justify-content: center;
		align-items: center;

		&:hover {
			color: var(--color-primary);
		}
	}
}
</style>
