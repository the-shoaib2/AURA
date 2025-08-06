<script setup lang="ts">
import { useTelemetry } from '@/composables/useTelemetry';
import { COMMUNITY_NODES_INSTALLATION_DOCS_URL, CUSTOM_NODES_DOCS_URL } from '@/constants';
import type { INodeUi } from '@/Interface';
import { isCommunityPackageName } from '@/utils/nodeTypesUtils';
import { auraIcon, auraLink, auraText } from '@aura/design-system';
import { useI18n } from '@aura/i18n';
import { computed } from 'vue';
import { I18nT } from 'vue-i18n';

const { node } = defineProps<{ node: INodeUi }>();

const i18n = useI18n();
const telemetry = useTelemetry();

const isCommunityNode = computed(() => isCommunityPackageName(node.type));
const npmPackage = computed(() => node.type.split('.')[0]);

function onMissingNodeTextClick(event: MouseEvent) {
	if (event.target instanceof Element && event.target.localName === 'a') {
		telemetry.track('user clicked cnr browse button', {
			source: 'cnr missing node modal',
		});
	}
}

function onMissingNodeLearnMoreLinkClick() {
	telemetry.track('user clicked cnr docs link', {
		source: 'missing node modal source',
		package_name: node.type.split('.')[0],
		node_type: node.type,
	});
}
</script>

<template>
	<div :class="$style.nodeIsNotValid">
		<p :class="$style.warningIcon">
			<auraIcon icon="triangle-alert" />
		</p>
		<div class="mt-s mb-xs">
			<auraText size="large" color="text-dark" bold>
				{{ i18n.baseText('nodeSettings.communityNodeUnknown.title') }}
			</auraText>
		</div>
		<div v-if="isCommunityNode" :class="$style.descriptionContainer">
			<div class="mb-l">
				<I18nT
					keypath="nodeSettings.communityNodeUnknown.description"
					tag="span"
					scope="global"
					@click="onMissingNodeTextClick"
				>
					<template #action>
						<a
							:href="`https://www.npmjs.com/package/${npmPackage}`"
							target="_blank"
							rel="noopener noreferrer"
						>
							{{ npmPackage }}
						</a>
					</template>
				</I18nT>
			</div>
			<auraLink :to="COMMUNITY_NODES_INSTALLATION_DOCS_URL" @click="onMissingNodeLearnMoreLinkClick">
				{{ i18n.baseText('nodeSettings.communityNodeUnknown.installLink.text') }}
			</auraLink>
		</div>
		<I18nT v-else keypath="nodeSettings.nodeTypeUnknown.description" tag="span" scope="global">
			<template #action>
				<a
					:href="CUSTOM_NODES_DOCS_URL"
					target="_blank"
					v-text="i18n.baseText('nodeSettings.nodeTypeUnknown.description.customNode')"
				/>
			</template>
		</I18nT>
	</div>
</template>

<style lang="scss" module>
.nodeIsNotValid {
	height: 75%;
	padding: 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	line-height: var(--font-line-height-regular);
}

.warningIcon {
	color: var(--color-text-lighter);
	font-size: var(--font-size-2xl);
}

.descriptionContainer {
	display: flex;
	flex-direction: column;
}
</style>
