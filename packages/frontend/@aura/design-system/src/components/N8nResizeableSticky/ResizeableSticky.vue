<script lang="ts" setup>
import { computed, ref, useAttrs } from 'vue';

import { type ResizeData } from '@aura/design-system/types';

import auraResizeWrapper from '../auraResizeWrapper/ResizeWrapper.vue';
import { defaultStickyProps } from '../auraSticky/constants';
import auraSticky from '../auraSticky/Sticky.vue';
import type { StickyProps } from '../auraSticky/types';

type ResizeableStickyProps = StickyProps & {
	scale?: number;
	gridSize?: number;
};

const props = withDefaults(defineProps<ResizeableStickyProps>(), {
	...defaultStickyProps,
	scale: 1,
	gridSize: 20,
});

const emit = defineEmits<{
	resize: [values: ResizeData];
	resizestart: [];
	resizeend: [];
	'markdown-click': [link: HTMLAnchorElement, e: MouseEvent];
}>();

const attrs = useAttrs();

const stickyBindings = computed(() => ({ ...props, ...attrs }));

const isResizing = ref(false);

const onResize = (values: ResizeData) => {
	emit('resize', values);
};

const onResizeStart = () => {
	isResizing.value = true;
	emit('resizestart');
};

const onResizeEnd = () => {
	isResizing.value = false;
	emit('resizeend');
};

const onMarkdownClick = (link: HTMLAnchorElement, event: MouseEvent) => {
	emit('markdown-click', link, event);
};
</script>

<template>
	<auraResizeWrapper
		:is-resizing-enabled="!readOnly"
		:height="height"
		:width="width"
		:min-height="minHeight"
		:min-width="minWidth"
		:scale="scale"
		:grid-size="gridSize"
		@resizeend="onResizeEnd"
		@resize="onResize"
		@resizestart="onResizeStart"
	>
		<auraSticky v-bind="stickyBindings" @markdown-click="onMarkdownClick" />
	</auraResizeWrapper>
</template>
