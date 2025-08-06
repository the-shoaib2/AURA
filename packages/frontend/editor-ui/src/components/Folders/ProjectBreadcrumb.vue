<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '@aura/i18n';
import { type Project, ProjectTypes } from '@/types/projects.types';
import { isIconOrEmoji, type IconOrEmoji } from '@aura/design-system/components/auraIconPicker/types';

type Props = {
	currentProject: Project;
	isDragging?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
	isDragging: false,
});

const emit = defineEmits<{
	projectHover: [];
	projectDrop: [];
}>();

const i18n = useI18n();

const projectIcon = computed((): IconOrEmoji => {
	if (props.currentProject?.type === ProjectTypes.Personal) {
		return { type: 'icon', value: 'user' };
	} else if (props.currentProject?.name) {
		return isIconOrEmoji(props.currentProject.icon)
			? props.currentProject.icon
			: { type: 'icon', value: 'layers' };
	} else {
		return { type: 'icon', value: 'house' };
	}
});

const projectName = computed(() => {
	if (props.currentProject.type === ProjectTypes.Personal) {
		return i18n.baseText('projects.menu.personal');
	}
	return props.currentProject.name;
});

const onHover = () => {
	emit('projectHover');
};

const onProjectMouseUp = () => {
	if (props.isDragging) {
		emit('projectDrop');
	}
};
</script>
<template>
	<div
		:class="{ [$style['home-project']]: true, [$style.dragging]: isDragging }"
		data-test-id="home-project"
		@mouseenter="onHover"
		@mouseup="isDragging ? onProjectMouseUp() : null"
	>
		<aura-link :to="`/projects/${currentProject.id}`" :class="[$style['project-link']]">
			<ProjectIcon :icon="projectIcon" :border-less="true" size="mini" :title="projectName" />
			<auraText size="medium" color="text-base" :class="$style['project-label']">
				{{ projectName }}
			</auraText>
		</aura-link>
	</div>
</template>

<style module lang="scss">
.home-project {
	display: flex;
	padding: var(--spacing-3xs) var(--spacing-4xs) var(--spacing-4xs);
	border: var(--border-width-base) var(--border-style-base) transparent;

	&.dragging:hover {
		border: var(--border-width-base) var(--border-style-base) var(--color-secondary);
		border-radius: var(--border-radius-base);
		background-color: var(--color-callout-secondary-background);
		* {
			cursor: grabbing;
			color: var(--color-text-base);
		}
	}

	&:hover :global(.aura-text) {
		color: var(--color-text-dark);
	}
}

.project-link :global(.aura-text) {
	display: flex;
	align-items: center;
	gap: var(--spacing-4xs);
}

:global(.aura-text).project-label {
	@media (max-width: $breakpoint-sm) {
		display: none;
	}
}
</style>
