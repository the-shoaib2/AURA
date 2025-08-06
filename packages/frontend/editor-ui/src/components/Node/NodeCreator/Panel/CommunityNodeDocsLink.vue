<script setup lang="ts">
import { i18n } from '@aura/i18n';

import { auraText, auraLink } from auraura/design-system';

export interface Props {
	packageName: string;
}

const props = defineProps<Props>();

const openCommunityNodeDocsPage = () => {
	const newTab = window.open(`https://www.npmjs.com/package/${props.packageName}`, '_blank');
	if (newTab) newTab.opener = null;
};
</script>

<template>
	<auraLink
		theme="text"
		:class="$style.container"
		:title="i18n.baseText('communityNodesDocsLink.link.title')"
		@click="openCommunityNodeDocsPage"
	>
		<auraText size="small" bold style="margin-right: 5px">
			{{ i18n.baseText('communityNodesDocsLink.title') }}
		</auraText>
		<auraIcon icon="external-link" />
	</auraLink>
</template>

<style lang="scss" module>
.container {
	display: flex;
	align-items: center;
	margin-left: auto;
	padding-bottom: var(--spacing-5xs);
}
</style>
