<script lang="ts" setup>
import { useI18n } from '@aura/i18n';
import { usePageRedirectionHelper } from '@/composables/usePageRedirectionHelper';

const pageRedirectionHelper = usePageRedirectionHelper();
const i18n = useI18n();

const goToUpgrade = async () => {
	await pageRedirectionHelper.goToUpgrade('insights', 'upgrade-insights');
};
</script>

<template>
	<div :class="$style.callout">
		<auraIcon icon="lock" size="xlarge"></auraIcon>
		<auraText bold tag="h4" size="large">
			{{ i18n.baseText('insights.dashboard.paywall.title') }}
		</auraText>
		<auraText>
			{{ i18n.baseText('insights.dashboard.paywall.description') }}
		</auraText>
		<auraButton type="primary" native-type="button" size="large" @click="goToUpgrade">
			{{ i18n.baseText('generic.upgrade') }}
		</auraButton>
	</div>
</template>

<style lang="scss" module>
.callout {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 6rem 0;
	align-items: center;
	max-width: 360px;
	margin: 0 auto;
	text-align: center;
	gap: 10px;
	justify-content: center;
}
</style>
