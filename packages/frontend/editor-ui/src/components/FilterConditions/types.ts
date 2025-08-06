import type { IconName } from '@aura/design-system/components/auraIcon/icons';
import type { BaseTextKey } from '@aura/i18n';
import type { FilterConditionValue, FilterOperatorValue } from 'aura-workflow';

export interface FilterOperator extends FilterOperatorValue {
	name: BaseTextKey;
}

export interface FilterOperatorGroup {
	id: string;
	name: BaseTextKey;
	icon?: IconName;
	children: FilterOperator[];
}

export type ConditionResult =
	| { status: 'resolve_error' }
	| { status: 'validation_error'; error: string; resolved: FilterConditionValue }
	| {
			status: 'success';
			result: boolean;
			resolved: FilterConditionValue;
	  };
