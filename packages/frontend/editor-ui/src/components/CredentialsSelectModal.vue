<script setup lang="ts">
import { useExternalHooks } from '@/composables/useExternalHooks';
import { useTelemetry } from '@/composables/useTelemetry';
import { useCredentialsStore } from '@/stores/credentials.store';
import { useUIStore } from '@/stores/ui.store';
import { useWorkflowsStore } from '@/stores/workflows.store';
import { auraButton, auraSelect } from '@aura/design-system';
import { createEventBus } from '@aura/utils/event-bus';
import { onMounted, ref } from 'vue';
import { CREDENTIAL_SELECT_MODAL_KEY } from '../constants';
import Modal from './Modal.vue';
import { useI18n } from '@aura/i18n';

const externalHooks = useExternalHooks();
const telemetry = useTelemetry();
const i18n = useI18n();

const modalBus = ref(createEventBus());
const selected = ref('');
const loading = ref(true);
const selectRef = ref<HTMLSelectElement>();

const credentialsStore = useCredentialsStore();
const uiStore = useUIStore();
const workflowsStore = useWorkflowsStore();

onMounted(async () => {
	try {
		await credentialsStore.fetchCredentialTypes(false);
	} catch (e) {}

	loading.value = false;

	setTimeout(() => {
		if (selectRef.value) {
			selectRef.value.focus();
		}
	}, 0);
});

function onSelect(type: string) {
	selected.value = type;
}

function openCredentialType() {
	modalBus.value.emit('close');
	uiStore.openNewCredential(selected.value);

	const telemetryPayload = {
		credential_type: selected.value,
		source: 'primary_menu',
		new_credential: true,
		workflow_id: workflowsStore.workflowId,
	};

	telemetry.track('User opened Credential modal', telemetryPayload);
	void externalHooks.run('credentialsSelectModal.openCredentialType', telemetryPayload);
}
</script>

<template>
	<Modal
		:name="CREDENTIAL_SELECT_MODAL_KEY"
		:event-bus="modalBus"
		width="50%"
		:center="true"
		:loading="loading"
		max-width="460px"
		min-height="250px"
	>
		<template #header>
			<h2 :class="$style.title">
				{{ i18n.baseText('credentialSelectModal.addNewCredential') }}
			</h2>
		</template>
		<template #content>
			<div>
				<div :class="$style.subtitle">
					{{ i18n.baseText('credentialSelectModal.selectAnAppOrServiceToConnectTo') }}
				</div>
				<auraSelect
					ref="selectRef"
					filterable
					default-first-option
					:placeholder="i18n.baseText('credentialSelectModal.searchForApp')"
					size="xlarge"
					:model-value="selected"
					data-test-id="new-credential-type-select"
					@update:model-value="onSelect"
				>
					<template #prefix>
						<aura-icon icon="search" />
					</template>
					<auraOption
						v-for="credential in credentialsStore.allCredentialTypes"
						:key="credential.name"
						:value="credential.name"
						:label="credential.displayName"
						filterable
						data-test-id="new-credential-type-select-option"
					/>
				</auraSelect>
			</div>
		</template>
		<template #footer>
			<div :class="$style.footer">
				<auraButton
					:label="i18n.baseText('credentialSelectModal.continue')"
					float="right"
					size="large"
					:disabled="!selected"
					data-test-id="new-credential-type-button"
					@click="openCredentialType"
				/>
			</div>
		</template>
	</Modal>
</template>

<style module lang="scss">
.title {
	font-size: var(--font-size-xl);
	line-height: var(--font-line-height-regular);
}

.subtitle {
	margin-bottom: var(--spacing-s);
	font-size: var(--font-size-m);
	line-height: var(--font-line-height-xloose);
}
</style>
