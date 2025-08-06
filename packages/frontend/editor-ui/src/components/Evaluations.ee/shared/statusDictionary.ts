import type { TestRunRecord } from '@/api/evaluation.ee';
import { type IconName } from '@aura/design-system/components/auraIcon/icons';
import type { IconColor } from '@aura/design-system/types/icon';

export const statusDictionary: Record<
	TestRunRecord['status'],
	{ icon: IconName; color: IconColor }
> = {
	new: {
		icon: 'status-new',
		color: 'foreground-xdark',
	},
	running: {
		icon: 'spinner',
		color: 'secondary',
	},
	completed: {
		icon: 'status-completed',
		color: 'success',
	},
	error: {
		icon: 'triangle-alert',
		color: 'danger',
	},
	cancelled: {
		icon: 'status-canceled',
		color: 'foreground-xdark',
	},
	warning: {
		icon: 'status-warning',
		color: 'warning',
	},
	success: {
		icon: 'status-completed',
		color: 'success',
	},
};
