<script lang="ts" setup>
import auraTooltip from '@aura/design-system/components/auraTooltip/Tooltip.vue';
import type { ButtonType } from '@aura/design-system/types/button';

import auraButton from '../auraButton';
import auraCallout, { type CalloutTheme } from '../auraCallout';
import auraHeading from '../auraHeading';
import { type IconName } from '../auraIcon/icons';
import auraText from '../auraText';

interface ActionBoxProps {
	emoji?: string;
	heading?: string;
	buttonText?: string;
	buttonType?: ButtonType;
	buttonDisabled?: boolean;
	buttonIcon?: IconName;
	description?: string;
	calloutText?: string;
	calloutTheme?: CalloutTheme;
	calloutIcon?: IconName;
}

defineOptions({ name: 'auraActionBox' });
withDefaults(defineProps<ActionBoxProps>(), {
	calloutTheme: 'info',
	buttonIcon: undefined,
});
</script>

<template>
	<div :class="['aura-action-box', $style.container]" data-test-id="action-box">
		<div v-if="emoji" :class="$style.emoji">
			{{ emoji }}
		</div>
		<div v-if="heading || $slots.heading" :class="$style.heading">
			<auraHeading size="xlarge" align="center">
				<slot name="heading">{{ heading }}</slot>
			</auraHeading>
		</div>
		<div v-if="description" :class="$style.description" @click="$emit('descriptionClick', $event)">
			<auraText color="text-base">
				<slot name="description">
					<span v-aura-html="description"></span>
				</slot>
			</auraText>
		</div>
		<auraTooltip :disabled="!buttonDisabled">
			<template #content>
				<slot name="disabledButtonTooltip"></slot>
			</template>
			<auraButton
				v-if="buttonText"
				:label="buttonText"
				:type="buttonType"
				:disabled="buttonDisabled"
				:icon="buttonIcon"
				size="large"
				@click="$emit('click:button', $event)"
			/>
		</auraTooltip>
		<auraCallout
			v-if="calloutText"
			:theme="calloutTheme"
			:icon="calloutIcon"
			:class="$style.callout"
		>
			<auraText color="text-base">
				<span v-aura-html="calloutText" size="small"></span>
			</auraText>
		</auraCallout>
	</div>
</template>

<style lang="scss" module>
.container {
	border: 2px dashed var(--color-foreground-base);
	border-radius: var(--border-radius-large);
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: var(--spacing-3xl);

	> * {
		margin-bottom: var(--spacing-l);

		&:last-child {
			margin-bottom: 0;
		}
	}
}

.emoji {
	font-size: 40px;
}

.heading {
	margin-bottom: var(--spacing-l);
	text-align: center;
}

.description {
	color: var(--color-text-base);
	margin-bottom: var(--spacing-xl);
	text-align: center;
}

.callout {
	width: 100%;
	text-align: left;
}
</style>
