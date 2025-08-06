<script setup lang="ts">
import TimeAgo from '../TimeAgo.vue';
import { useI18n } from '@aura/i18n';
import type { ICredentialsDecryptedResponse, ICredentialsResponse } from '@/Interface';
import { auraText } from 'aurara/design-system';

type Props = {
	currentCredential: ICredentialsResponse | ICredentialsDecryptedResponse | null;
};

defineProps<Props>();

const i18n = useI18n();
</script>

<template>
	<div :class="$style.container">
		<el-row v-if="currentCredential">
			<el-col :span="8" :class="$style.label">
				<auraText :compact="true" :bold="true">
					{{ i18n.baseText('credentialEdit.credentialInfo.created') }}
				</auraText>
			</el-col>
			<el-col :span="16" :class="$style.valueLabel">
				<auraText :compact="true"
					><TimeAgo :date="currentCredential.createdAt" :capitalize="true"
				/></auraText>
			</el-col>
		</el-row>
		<el-row v-if="currentCredential">
			<el-col :span="8" :class="$style.label">
				<auraText :compact="true" :bold="true">
					{{ i18n.baseText('credentialEdit.credentialInfo.lastModified') }}
				</auraText>
			</el-col>
			<el-col :span="16" :class="$style.valueLabel">
				<auraText :compact="true"
					><TimeAgo :date="currentCredential.updatedAt" :capitalize="true"
				/></auraText>
			</el-col>
		</el-row>
		<el-row v-if="currentCredential">
			<el-col :span="8" :class="$style.label">
				<auraText :compact="true" :bold="true">
					{{ i18n.baseText('credentialEdit.credentialInfo.id') }}
				</auraText>
			</el-col>
			<el-col :span="16" :class="$style.valueLabel">
				<auraText :compact="true">{{ currentCredential.id }}</auraText>
			</el-col>
		</el-row>
	</div>
</template>

<style lang="scss" module>
.container {
	> * {
		margin-bottom: var(--spacing-l);
	}
}

.label {
	font-weight: var(--font-weight-bold);
	max-width: 230px;
}

.accessLabel {
	composes: label;
	margin-top: var(--spacing-5xs);
}

.valueLabel {
	font-weight: var(--font-weight-regular);
}
</style>
