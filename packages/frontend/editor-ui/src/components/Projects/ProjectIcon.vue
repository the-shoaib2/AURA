<script setup lang="ts">
import { type IconOrEmoji } from '@aura/design-system/components/auraIconPicker/types';

type Props = {
	icon: IconOrEmoji;
	size?: 'mini' | 'small' | 'medium' | 'large';
	round?: boolean;
	borderLess?: boolean;
	color?: 'text-light' | 'text-base' | 'text-dark';
};

const props = withDefaults(defineProps<Props>(), {
	size: 'medium',
	round: false,
	borderLess: false,
	color: 'text-base',
});
</script>
<template>
	<div
		:class="[
			$style.container,
			$style[props.size],
			{ [$style.round]: props.round, [$style.borderless]: props.borderLess },
		]"
	>
		<auraIcon
			v-if="icon.type === 'icon'"
			:icon="icon.value"
			:class="$style.icon"
			:color="color"
		></auraIcon>
		<auraText v-else-if="icon.type === 'emoji'" color="text-light" :class="$style.emoji">
			{{ icon.value }}
		</auraText>
	</div>
</template>

<style lang="scss" module>
.container {
	display: flex;
	align-items: center;
	justify-content: center;
	border: var(--border-width-base) var(--border-style-base) var(--color-foreground-light);
	border-radius: var(--border-radius-base);

	&.round {
		border-radius: 50%;
	}

	&.borderless {
		border: none;
	}
}

.mini {
	width: var(--spacing-xs);
	height: var(--spacing-xs);

	.icon {
		font-size: var(--font-size-2xs);
	}

	.emoji {
		font-size: var(--font-size-3xs);
	}
}

.small {
	min-width: var(--spacing-l);
	height: var(--spacing-l);

	.emoji {
		font-size: var(--font-size-2xs);
	}
}

.medium {
	min-width: var(--spacing-xl);
	height: var(--spacing-xl);

	.emoji {
		font-size: var(--font-size-xs);
	}
}

.large {
	// Making this in line with user avatar size
	min-width: 40px;
	height: 40px;

	.emoji {
		font-size: var(--font-size-s);
	}
}
</style>
