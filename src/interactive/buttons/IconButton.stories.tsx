import type { Meta, StoryObj } from '@storybook/react';
import IconButton from './IconButton';

const meta = {
  title: 'Interactive/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'text',
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Search: Story = {
  args: {
    icon: 'search',
  },
};

export const Heart: Story = {
  args: {
    icon: 'heart',
  },
};

export const Star: Story = {
  args: {
    icon: 'star',
  },
};

export const Settings: Story = {
  args: {
    icon: 'cog',
  },
};

export const User: Story = {
  args: {
    icon: 'user',
  },
};

export const Plus: Story = {
  args: {
    icon: 'plus',
  },
};

export const Edit: Story = {
  args: {
    icon: 'edit',
  },
};

export const Delete: Story = {
  args: {
    icon: 'trash',
  },
};

export const WithCustomClass: Story = {
  args: {
    icon: 'check',
    className: 'bg-green-500 text-white rounded-full',
  },
};
