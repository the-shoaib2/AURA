<script setup lang="ts">
import { createEventBus } from '@aura/utils/event-bus';
import Modal from '@/components/Modal.vue';
import { WORKFLOW_ACTIVATION_CONFLICTING_WEBHOOK_MODAL_KEY } from '@/constants';
import { useUIStore } from '@/stores/ui.store';

import { useRootStore } from '@aura/stores/useRootStore';
import { computed } from 'vue';
import { FORM_TRIGGER_NODE_TYPE } from 'aura-workflow';

const modalBus = createEventBus();
const uiStore = useUIStore();
const rootStore = useRootStore();

const props = defineProps<{
	data: {
		workflowName: string;
		triggerType: string;
		workflowId: string;
		webhookPath: string;
		node: string;
	};
}>();

const { data } = props;

const webhookUrl = computed(() => {
	return rootStore.webhookUrl;
});

const webhookType = computed(() => {
	if (data.triggerType === FORM_TRIGGER_NODE_TYPE) return 'form';
	return 'webhook';
});

const workflowUrl = computed(() => {
	return rootStore.urlBaseEditor + 'workflow/' + data.workflowId;
});

const onClick = async () => {
	uiStore.closeModal(WORKFLOW_ACTIVATION_CONFLICTING_WEBHOOK_MODAL_KEY);
};
</script>

<template>
	<Modal
		width="540px"
		:name="WORKFLOW_ACTIVATION_CONFLICTING_WEBHOOK_MODAL_KEY"
		:title="`Conflicting ${webhookType === 'form' ? 'Form' : 'Webhook'} Path`"
		:event-bus="modalBus"
		:center="true"
	>
		<template #content>
			<aura-callout theme="danger" data-test-id="conflicting-webhook-callout">
				A {{ webhookType }} trigger '{{ data.node }}' in the workflow '{{ data.workflowName }}' uses
				a conflicting URL path, so this workflow cannot be activated
			</aura-callout>
			<div :class="$style.container">
				<div>
					<aura-text color="text-base"> You can deactivate <aurara-text>
					<aura-link :to="workflowUrl" :underline="true"> '{{ data.workflowName }}' <aurara-link>
					<aura-text color="text-base">
						and activate this one, or adjust the following URL path in either workflow:
					</aura-text>
				</div>
			</div>
			<div data-test-id="conflicting-webhook-path">
				<aura-text color="text-light"> {{ webhookUrl }}/<aurara-text>
				<aura-text color="text-dark" bold>
					{{ data.webhookPath }}
				</aura-text>
			</div>
		</template>
		<template #footer>
			<aura-button
				label="Done"
				size="medium"
				float="right"
				data-test-id="close-button"
				@click="onClick"
			/>
		</template>
	</Modal>
</template>

<style module lang="scss">
.container {
	margin-top: var(--spacing-m);
	margin-bottom: var(--spacing-s);
}
</style>
