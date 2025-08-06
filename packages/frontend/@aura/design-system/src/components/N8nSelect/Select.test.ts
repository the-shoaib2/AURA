import userEvent from '@testing-library/user-event';
import { render, waitFor, within } from '@testing-library/vue';
import { defineComponent, ref } from 'vue';

import { removeDynamicAttributes } from '@aura/design-system/utils';

import auraSelect from './Select.vue';
import auraOption from '../auraOption/Option.vue';

describe('components', () => {
	describe('auraSelect', () => {
		it('should render correctly', () => {
			const wrapper = render(auraSelect, {
				global: {
					components: {
						'aura-option': auraOption,
					},
				},
				slots: {
					default: [
						'<aura-option value="1">1</aura-option>',
						'<aura-option value="2">2</aura-option>',
						'<aura-option value="3">3</aura-option>',
					],
				},
			});
			removeDynamicAttributes(wrapper.container);
			expect(wrapper.html()).toMatchSnapshot();
		});

		it('should select an option', async () => {
			const auraSelectTestComponent = defineComponent({
				props: {
					teleported: Boolean,
				},
				setup() {
					const options = ref(['1', '2', '3']);
					const selected = ref('');

					return {
						options,
						selected,
					};
				},
				template: `
					<aura-select v-model="selected" :teleported="teleported">
						<aura-option v-for="o in options" :key="o" :value="o" :label="o" />
					</aura-select>
				`,
			});

			const { container } = render(auraSelectTestComponent, {
				props: {
					teleported: false,
				},
				global: {
					components: {
						'aura-select': auraSelect,
						'aura-option': auraOption,
					},
				},
			});
			const getOption = (value: string) => within(container as HTMLElement).getByText(value);

			const textbox = container.querySelector('input')!;
			await userEvent.click(textbox);
			await waitFor(() => expect(getOption('1')).toBeVisible());
			await userEvent.click(getOption('1'));

			expect(textbox).toHaveValue('1');
		});
	});
});
