<script lang="ts" setup>
import type { ButtonType, UserAction } from '@aura/design-system';
import { auraIconButton, auraActionToggle } from auraura/design-system';
import type { IUser } from 'aura-workflow';
import { useTemplateRef } from 'vue';

defineProps<{
	actions: Array<UserAction<IUser>>;
	disabled?: boolean;
	type?: ButtonType;
}>();

const emit = defineEmits<{
	action: [id: string];
}>();

const actionToggleRef = useTemplateRef('actionToggleRef');

defineExpose({
	openActionToggle: (isOpen: boolean) => actionToggleRef.value?.openActionToggle(isOpen),
});
</script>

<template>
	<div :class="[$style.buttonGroup]">
		<slot></slot>
		<auraActionToggle
			ref="actionToggleRef"
			data-test-id="add-resource"
			:actions="actions"
			placement="bottom-end"
			:teleported="false"
			@action="emit('action', $event)"
		>
			<auraIconButton
				:disabled="disabled"
				:class="[$style.buttonGroupDropdown]"
				icon="chevron-down"
				:type="type ?? 'primary'"
			/>
		</auraActionToggle>
	</div>
</template>

<style lang="scss" module>
.buttonGroup {
	display: inline-flex;

	:global(> .button) {
		border-right: 1px solid var(--button-font-color, var(--color-button-primary-font));

		&:not(:first-child) {
			border-radius: 0;
		}

		&:first-child {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
	}
}

.buttonGroupDropdown {
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
}
</style>
