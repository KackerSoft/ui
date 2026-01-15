import type { Meta, StoryObj } from '@storybook/react';
import Input from './Input';

const meta = {
  title: 'Interactive/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
    },
    error: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text here',
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Email',
    defaultValue: 'user@example.com',
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Email',
    error: 'This field is required',
  },
};

export const WithLeftIcon: Story = {
  args: {
    placeholder: 'Search',
    left: <i className="fas fa-search" />,
  },
};

export const WithRightIcon: Story = {
  args: {
    placeholder: 'Password',
    right: <i className="fas fa-eye" />,
    type: 'password',
  },
};

export const NumberInput: Story = {
  args: {
    placeholder: 'Amount',
    type: 'number',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
    defaultValue: 'Cannot edit this',
  },
};
