import type { KeyboardShortcut } from '@aura/design-system/types/keyboardshortcut';

import type { IconName } from '../components/auraIcon/icons';

export interface ActionDropdownItem {
	id: string;
	label: string;
	badge?: string;
	badgeProps?: Record<string, unknown>;
	icon?: IconName;
	divided?: boolean;
	disabled?: boolean;
	shortcut?: KeyboardShortcut;
	customClass?: string;
	checked?: boolean;
}
