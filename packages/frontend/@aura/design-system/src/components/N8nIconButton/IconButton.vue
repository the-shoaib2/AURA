<script lang="ts" setup>
import type { IconButtonProps } from '@aura/design-system/types/button';

import auraButton from '../auraButton';

defineOptions({ name: 'auraIconButton' });
withDefaults(defineProps<IconButtonProps>(), {
	type: 'primary',
	size: 'medium',
	loading: false,
	outline: false,
	text: false,
	disabled: false,
	active: false,
});
</script>

<template>
	<auraButton square v-bind="{ ...$attrs, ...$props }" />
</template>
