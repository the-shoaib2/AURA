<script setup lang="ts">
import { useI18n } from '@aura/i18n';
import { type LlmTokenUsageData } from '@/Interface';
import { formatTokenUsageCount } from '@/utils/aiUtils';
import { auraTooltip } from 'aurara/design-system';

const { consumedTokens } = defineProps<{ consumedTokens: LlmTokenUsageData }>();
const locale = useI18n();
</script>

<template>
	<auraTooltip v-if="consumedTokens !== undefined" :enterable="false">
		<span>{{
			locale.baseText('runData.aiContentBlock.tokens', {
				interpolate: {
					count: formatTokenUsageCount(consumedTokens, 'total'),
				},
			})
		}}</span>
		<template #content>
			<ConsumedTokensDetails :consumed-tokens="consumedTokens" />
		</template>
	</auraTooltip>
</template>
