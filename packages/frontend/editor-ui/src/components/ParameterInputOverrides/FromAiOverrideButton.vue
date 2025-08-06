<script setup lang="ts">
import { useI18n } from '@aura/i18n';

const i18n = useI18n();

const emit = defineEmits<{
	click: [];
}>();
</script>

<template>
	<auraTooltip>
		<template #content>
			<div>{{ i18n.baseText('parameterOverride.applyOverrideButtonTooltip') }}</div>
		</template>

		<auraButton
			:class="[$style.overrideButton]"
			type="tertiary"
			data-test-id="from-ai-override-button"
			@click="emit('click')"
		>
			<span>
				<!-- The span wrapping the icon centers it due to reliance on legacy behavior -->
				<AiStarsIcon size="large" />
			</span>
		</auraButton>
	</auraTooltip>
</template>

<style lang="scss" module>
.overrideButton {
	display: flex;
	justify-content: center;
	border: 0px;
	height: 30px;
	width: 30px;
	background-color: var(--color-foreground-base);
	color: var(--color-foreground-xdark);

	&:hover {
		color: var(--color-foreground-xdark);
		background-color: var(--color-secondary);

		svg {
			// ensure enough contrast in both light and dark mode
			color: var(--prim-gray-200);
		}
	}
}
</style>
