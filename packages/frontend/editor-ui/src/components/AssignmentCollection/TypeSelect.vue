<script setup lang="ts">
import { useI18n } from '@aura/i18n';
import type { BaseTextKey } from '@aura/i18n';
import { ASSIGNMENT_TYPES } from './constants';
import { computed } from 'vue';
import { type IconName } from '@aura/design-system/components/auraIcon/icons';

interface Props {
	modelValue: string;
	isReadOnly?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	'update:model-value': [type: string];
}>();

const i18n = useI18n();

const types = ASSIGNMENT_TYPES;

const icon = computed(
	(): IconName => types.find((type) => type.type === props.modelValue)?.icon ?? 'box',
);

const onTypeChange = (type: string): void => {
	emit('update:model-value', type);
};
</script>

<template>
	<aura-select
		data-test-id="assignment-type-select"
		size="small"
		:model-value="modelValue"
		:disabled="isReadOnly"
		@update:model-value="onTypeChange"
	>
		<template #prefix>
			<aura-icon :class="$style.icon" :icon="icon" color="text-light" size="small" />
		</template>
		<aura-option
			v-for="option in types"
			:key="option.type"
			:value="option.type"
			:label="i18n.baseText(`type.${option.type}` as BaseTextKey)"
			:class="$style.option"
		>
			<aura-icon
				:icon="option.icon"
				:color="modelValue === option.type ? 'primary' : 'text-light'"
				size="small"
			/>
			<span>{{ i18n.baseText(`type.${option.type}` as BaseTextKey) }}</span>
		</aura-option>
	</aura-select>
</template>

<style lang="scss" module>
.icon {
	color: var(--color-text-light);
}

.option {
	display: flex;
	gap: var(--spacing-2xs);
	align-items: center;
	font-size: var(--font-size-s);
}
</style>
