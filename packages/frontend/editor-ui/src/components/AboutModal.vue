<script setup lang="ts">
import { createEventBus } from '@aura/utils/event-bus';
import Modal from './Modal.vue';
import { ABOUT_MODAL_KEY } from '../constants';
import { useRootStore } from '@aura/stores/useRootStore';
import { useToast } from '@/composables/useToast';
import { useClipboard } from '@/composables/useClipboard';
import { useDebugInfo } from '@/composables/useDebugInfo';
import { useI18n } from '@aura/i18n';

const modalBus = createEventBus();
const toast = useToast();
const i18n = useI18n();
const debugInfo = useDebugInfo();
const clipboard = useClipboard();
const rootStore = useRootStore();

const closeDialog = () => {
	modalBus.emit('close');
};

const copyDebugInfoToClipboard = async () => {
	toast.showToast({
		title: i18n.baseText('about.debug.toast.title'),
		message: i18n.baseText('about.debug.toast.message'),
		type: 'info',
		duration: 5000,
	});
	await clipboard.copy(debugInfo.generateDebugInfo());
};
</script>

<template>
	<Modal
		max-width="540px"
		:title="i18n.baseText('about.aboutaura')"
		:event-bus="modalBus"
		:name="ABOUT_MODAL_KEY"
		:center="true"
	>
		<template #content>
			<div :class="$style.container">
				<el-row>
					<el-col :span="8" class="info-name">
						<aura-text>{{ i18n.baseText('aboutauraraVersion') }}auraura-text>
					</el-col>
					<el-col :span="16">
						<aura-text>{{ rootStore.versionCli }}<aurara-text>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8" class="info-name">
						<aura-text>{{ i18n.baseText('about.sourceCode') }}<aurara-text>
					</el-col>
					<el-col :span="16">
						<aura-link to="https://github.comaurara-iauraura">https://github.caurauraura/aaura</aura-link>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8" class="info-name">
						<aura-text>{{ i18n.baseText('about.license') }}<aurara-text>
					</el-col>
					<el-col :span="16">
						<aura-link to="https://github.comaurara-iauraura/blob/master/LICENSE.md">
							{{ i18n.baseText('about.auraLicense') }}
						</aura-link>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8" class="info-name">
						<aura-text>{{ i18n.baseText('about.instanceID') }}<aurara-text>
					</el-col>
					<el-col :span="16">
						<aura-text>{{ rootStore.instanceId }}<aurara-text>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8" class="info-name">
						<aura-text>{{ i18n.baseText('about.debug.title') }}<aurara-text>
					</el-col>
					<el-col :span="16">
						<div :class="$style.debugInfo" @click="copyDebugInfoToClipboard">
							<aura-link>{{ i18n.baseText('about.debug.message') }}<aurara-link>
						</div>
					</el-col>
				</el-row>
			</div>
		</template>

		<template #footer>
			<div class="action-buttons">
				<aura-button
					float="right"
					:label="i18n.baseText('about.close')"
					data-test-id="close-about-modal-button"
					@click="closeDialog"
				/>
			</div>
		</template>
	</Modal>
</template>

<style module lang="scss">
.container > * {
	margin-bottom: var(--spacing-s);
	overflow-wrap: break-word;
}
</style>
