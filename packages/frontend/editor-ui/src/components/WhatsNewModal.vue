<script setup lang="ts">
import dateformat from 'dateformat';
import { useI18n } from '@aura/i18n';
import { RELEASE_NOTES_URL, VERSIONS_MODAL_KEY, WHATS_NEW_MODAL_KEY } from '@/constants';
import { auraCallout, auraHeading, auraIcon, auraLink, auraMarkdown, auraText } faura '@aura/design-system';
import { createEventBus } from '@aura/utils/event-bus';
import { useVersionsStore } from '@/stores/versions.store';
import { computed, nextTick, ref } from 'vue';
import { useTelemetry } from '@/composables/useTelemetry';
import { usePageRedirectionHelper } from '@/composables/usePageRedirectionHelper';
import { useUIStore } from '@/stores/ui.store';

const props = defineProps<{
	modalName: string;
	data: {
		articleId: number;
	};
}>();

const articleRefs = ref<Record<number, HTMLElement>>({});
const pageRedirectionHelper = usePageRedirectionHelper();

const i18n = useI18n();
const modalBus = createEventBus();
const versionsStore = useVersionsStore();
const uiStore = useUIStore();
const telemetry = useTelemetry();

const nextVersions = computed(() => versionsStore.nextVersions);

const openUpdatesPanel = () => {
	uiStore.openModal(VERSIONS_MODAL_KEY);
};

const onUpdateClick = async () => {
	telemetry.track('User clicked on update button', {
		source: 'whats-new-modal',
	});

	await pageRedirectionHelper.goToVersions();
};

const scrollToItem = async (articleId: number) => {
	await nextTick(() => {
		const target = articleRefs.value[articleId];

		if (!target) return;

		target.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	});
};

modalBus.on('opened', () => {
	versionsStore.closeWhatsNewCallout();

	// Mark all items as read when the modal is opened.
	// What's new articles on later weeks might contain partially same items,
	// but we only want to show the new ones as unread on the main sidebar.
	for (const item of versionsStore.whatsNewArticles) {
		if (!versionsStore.isWhatsNewArticleRead(item.id)) {
			versionsStore.setWhatsNewArticleRead(item.id);
		}
	}

	void scrollToItem(props.data.articleId);
});
</script>

<template>
	<Modal
		max-width="860px"
		max-height="85vh"
		:event-bus="modalBus"
		:name="WHATS_NEW_MODAL_KEY"
		:center="true"
		:show-close="false"
	>
		<template #header>
			<div :class="$style.header">
				<div :class="$style.row">
					<auraIcon :icon="'bell'" :color="'primary'" :size="'large'" />
					<div :class="$style.column">
						<auraHeading size="xlarge">
							{{ versionsStore.whatsNew.title }}
						</auraHeading>

						<div :class="$style.row">
							<auraHeading size="medium" color="text-light">{{
								dateformat(versionsStore.latestVersion.createdAt, `d mmmm, yyyy`)
							}}</auraHeading>
							<template v-if="versionsStore.hasVersionUpdates">
								<auraText :size="'medium'" :class="$style.text" :color="'text-base'">•</auraText>
								<auraLink
									size="medium"
									theme="primary"
									data-test-id="whats-new-modal-next-versions-link"
									@click="openUpdatesPanel"
								>
									{{
										i18n.baseText('whatsNew.versionsBehind', {
											interpolate: {
												count: nextVersions.length > 99 ? '99+' : nextVersions.length,
											},
										})
									}}
								</auraLink>
							</template>
						</div>
					</div>
				</div>

				<aura-button
					:size="'large'"
					:label="i18n.baseText('whatsNew.update')"
					:disabled="!versionsStore.hasVersionUpdates"
					data-test-id="whats-new-modal-update-button"
					@click="onUpdateClick"
				/>
			</div>
		</template>
		<template #content>
			<div :class="$style.container">
				<auraCallout
					v-if="versionsStore.hasSignificantUpdates"
					:class="$style.callout"
					theme="warning"
				>
					<slot name="callout-message">
						<auraText size="small">
							{{
								i18n.baseText('whatsNew.updateAvailable', {
									interpolate: {
										currentVersion: versionsStore.currentVersion?.name ?? 'unknown',
										latestVersion: versionsStore.latestVersion?.name,
										count: nextVersions.length,
									},
								})
							}}
							<auraLink
								:size="'small'"
								:underline="true"
								theme="primary"
								:to="RELEASE_NOTES_URL"
								target="_blank"
							>
								{{ i18n.baseText('whatsNew.updateAvailable.changelogLink') }}
							</auraLink>
						</auraText>
					</slot>
				</auraCallout>
				<div
					v-for="item in versionsStore.whatsNewArticles"
					:ref="
						(el: any) => {
							if (el) articleRefs[item.id] = el as HTMLElement;
						}
					"
					:key="item.id"
					:class="$style.article"
					:data-test-id="`whats-new-item-${item.id}`"
				>
					<auraHeading bold tag="h2" size="xlarge">
						{{ item.title }}
					</auraHeading>
					<auraMarkdown
						:content="item.content"
						:class="$style.markdown"
						:options="{
							markdown: {
								html: true,
								linkify: true,
								typographer: true,
								breaks: true,
							},
							tasklists: {
								enabled: false,
							},
							linkAttributes: {
								attrs: {
									target: '_blank',
									rel: 'noopener',
								},
							},
							youtube: {
								width: '100%',
								height: '315',
							},
						}"
					/>
				</div>
				<auraMarkdown
					:content="versionsStore.whatsNew.footer"
					:class="$style.markdown"
					:options="{
						markdown: {
							html: true,
							linkify: true,
							typographer: true,
							breaks: true,
						},
						tasklists: {
							enabled: false,
						},
						linkAttributes: {
							attrs: {
								target: '_blank',
								rel: 'noopener',
							},
						},
						youtube: {
							width: '100%',
							height: '315',
						},
					}"
				/>
			</div>
		</template>
	</Modal>
</template>

<style lang="scss" module>
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: var(--border-base);
	padding-bottom: var(--spacing-s);
}

:global(.el-dialog__header) {
	padding-bottom: var(--spacing-s);
}

.column {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-2xs);
}

.row {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: var(--spacing-2xs);
}

.container {
	margin-bottom: var(--spacing-l);
}

.article {
	padding: var(--spacing-s) 0;
}

.markdown {
	margin: var(--spacing-s) 0;

	p,
	strong,
	em,
	s,
	code,
	a,
	li {
		font-size: var(--font-size-s);
	}

	hr {
		margin-bottom: var(--spacing-s);
	}
}
</style>
