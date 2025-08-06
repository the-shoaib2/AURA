<script lang="ts" setup>
import type { Placement } from 'element-plus';
import { computed } from 'vue';

import type { IconSize } from '@aura/design-system/types';
import type { IconColor } from '@aura/design-system/types/icon';

import auraIcon from '../auraIcon';
import { type IconName } from '../auraIcon/icons';
import auraTooltip from '../auraTooltip';

const THEME = ['info', 'info-light', 'warning', 'warning-light', 'danger', 'success'] as const;
const TYPE = ['note', 'tooltip'] as const;

const ICON_MAP: { [name: string]: IconName } = {
	info: 'info',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	'info-light': 'info',
	warning: 'triangle-alert',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	'warning-light': 'triangle', // NOTE: This requires a custom icon
	danger: 'triangle-alert',
	success: 'circle-check',
} as const;

const COLOR_MAP: Record<keyof IconMap, IconColor> = {
	info: 'text-base',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	'info-light': 'text-base',
	warning: 'warning',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	'warning-light': 'warning',
	danger: 'danger',
	success: 'success',
};

type IconMap = typeof ICON_MAP;

interface InfoTipProps {
	theme?: (typeof THEME)[number];
	type?: (typeof TYPE)[number];
	bold?: boolean;
	tooltipPlacement?: Placement;
	enterable?: boolean;
	size?: IconSize;
}

defineOptions({ name: 'auraInfoTip' });
const props = withDefaults(defineProps<InfoTipProps>(), {
	theme: 'info',
	type: 'note',
	bold: true,
	tooltipPlacement: 'top',
	enterable: true,
	size: undefined,
});

const iconData = computed<{ icon: IconName; color: IconColor }>(() => {
	return {
		icon: ICON_MAP[props.theme],
		color: COLOR_MAP[props.theme],
	} as const;
});
</script>

<template>
	<div
		:class="{
			'aura-info-tip': true,
			[$style.infoTip]: true,
			[$style[theme]]: true,
			[$style[type]]: true,
			[$style.bold]: bold,
		}"
	>
		<!-- Note that the branching is required to support displaying
		 the slot either in the tooltip of the icon or following it -->
		<auraTooltip
			v-if="type === 'tooltip'"
			:placement="tooltipPlacement"
			:popper-class="$style.tooltipPopper"
			:disabled="type !== 'tooltip'"
			:enterable
		>
			<span :class="$style.iconText">
				<auraIcon :icon="iconData.icon" :color="iconData.color" :size="size" />
			</span>
			<template #content>
				<span>
					<slot />
				</span>
			</template>
		</auraTooltip>
		<span v-else :class="$style.iconText">
			<auraIcon :icon="iconData.icon" :color="iconData.color" :size="size" />
			<span>
				<slot />
			</span>
		</span>
	</div>
</template>

<style lang="scss" module>
.infoTip {
	display: flex;
}

.base {
	font-size: var(--font-size-2xs);
	line-height: var(--font-size-s);
	word-break: normal;
	display: flex;
	align-items: center;

	svg {
		font-size: var(--font-size-s);
	}
}

.bold {
	font-weight: var(--font-weight-medium);
}

.note {
	composes: base;

	svg {
		margin-right: var(--spacing-4xs);
	}
}

.tooltipPopper {
	composes: base;
	display: inline-flex;
}

.iconText {
	display: inline-flex;
	align-items: flex-start;
}
</style>
