import { auraComponent, auraComponentSize } from '../component';
import { ButtonTheme, ButtonType } from '../auraButton';

/** Icon Button Component */
export declare class auraIconButton extends auraComponent {
	/** Button type */
	type: ButtonType;

	/** Button title on hover */
	title: string;

	/** Button size */
	size: auraComponentSize | 'xlarge';

	/** Determine whether it's loading */
	loading: boolean;

	/** Disable the button */
	disabled: boolean;

	/** Button icon, accepts an icon name of font awesome icon component */
	icon: string;

	/** Button theme */
	theme: ButtonTheme;
}
