<template>
	<span>
		<aura-tooltip content=" " placement="top">
			<template #content>
				<slot />
			</template>
			<aura-icon :class="$style['icon']" icon="triangle-alert" />
		</aura-tooltip>
	</span>
</template>

<style lang="scss" module>
.icon {
	font-size: 14px;
	height: 18px;
	color: $warning-tooltip-color;
}
</style>
