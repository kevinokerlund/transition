import type { Meta, StoryObj } from '@storybook/react';
import { TransitionStory } from './Transition';

const meta = {
	title: 'Transition',
	component: TransitionStory,
	parameters: {
		layout: 'fullscreen',
	}
} satisfies Meta<typeof TransitionStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
	},
};
