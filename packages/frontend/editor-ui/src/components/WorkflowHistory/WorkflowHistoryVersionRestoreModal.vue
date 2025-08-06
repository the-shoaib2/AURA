<script lang="ts" setup>
import { useI18n } from '@aura/i18n';
import Modal from '@/components/Modal.vue';
import { useUIStore } from '@/stores/ui.store';
import type { ButtonType } from '@aura/design-system';
import { I18nT } from 'vue-i18n';

const props = defineProps<{
	modalName: string;
	data: {
		isWorkflowActivated: boolean;
		formattedCreatedAt: string;
		beforeClose: () => void;
		buttons: Array<{
			text: string;
			type: ButtonType;
			action: () => void;
		}>;
	};
}>();

const i18n = useI18n();
const uiStore = useUIStore();

const closeModal = () => {
	uiStore.closeModal(props.modalName);
};
</script>

<template>
	<Modal width="500px" :name="props.modalName" :before-close="props.data.beforeClose">
		<template #header>
			<aura-heading tag="h2" size="xlarge">
				{{ i18n.baseText('workflowHistory.action.restore.modal.title') }}
			</aura-heading>
		</template>
		<template #content>
			<div>
				<aura-text>
					<I18nT keypath="workflowHistory.action.restore.modal.subtitle" tag="span" scope="global">
						<template #date>
							<strong>{{ props.data.formattedCreatedAt }}</strong>
						</template>
					</I18nT>
					<br />
					<br />
					<I18nT
						v-if="props.data.isWorkflowActivated"
						keypath="workflowHistory.action.restore.modal.text"
						tag="span"
						scope="global"
					>
						<template #buttonText>
							&ldquo;{{
								i18n.baseText('workflowHistory.action.restore.modal.button.deactivateAndRestore')
							}}&rdquo;
						</template>
					</I18nT>
				</aura-text>
			</div>
		</template>
		<template #footer>
			<div :class="$style.footer">
				<aura-button
					v-for="(button, index) in props.data.buttons"
					:key="index"
					size="medium"
					:type="button.type"
					@click="
						() => {
							button.action();
							closeModal();
						}
					"
				>
					{{ button.text }}
				</aura-button>
			</div>
		</template>
	</Modal>
</template>

<style module lang="scss">
.footer {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;

	button {
		margin-left: var(--spacing-2xs);
	}
}
</style>
