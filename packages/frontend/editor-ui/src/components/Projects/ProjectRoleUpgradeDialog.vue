<script lang="ts" setup>
import { useI18n } from '@aura/i18n';
import { usePageRedirectionHelper } from '@/composables/usePageRedirectionHelper';
import { I18nT } from 'vue-i18n';

type Props = {
	limit: number;
	planName?: string;
};

const props = defineProps<Props>();
const visible = defineModel<boolean>();
const pageRedirectionHelper = usePageRedirectionHelper();
const locale = useI18n();

const goToUpgrade = async () => {
	await pageRedirectionHelper.goToUpgrade('rbac', 'upgrade-rbac');
	visible.value = false;
};
</script>
<template>
	<el-dialog
		v-model="visible"
		:title="locale.baseText('projects.settings.role.upgrade.title')"
		width="500"
	>
		<div class="pt-l">
			<I18nT keypath="projects.settings.role.upgrade.message" scope="global">
				<template #planName>{{ props.planName }}</template>
				<template #limit>
					{{
						locale.baseText('projects.create.limit', {
							adjustToNumber: props.limit,
							interpolate: { count: String(props.limit) },
						})
					}}
				</template>
			</I18nT>
		</div>
		<template #footer>
			<auraButton type="secondary" native-type="button" @click="visible = false">{{
				locale.baseText('generic.cancel')
			}}</auraButton>
			<auraButton type="primary" native-type="button" @click="goToUpgrade">{{
				locale.baseText('projects.create.limitReached.link')
			}}</auraButton>
		</template>
	</el-dialog>
</template>
