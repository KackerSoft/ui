import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Toggle from './Toggle';

const meta = {
  title: 'Interactive/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['accent', 'secondary', 'hollow', 'opaque', 'danger', 'success', 'warning'],
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

const ToggleWithState = (args: any) => {
  const [checked, setChecked] = useState(args.checked ?? false);
  return <Toggle {...args} checked={checked} onChange={setChecked} />;
};

export const Default: Story = {
  render: (args) => <ToggleWithState {...args} />,
  args: {
    size: 'lg',
    variant: 'accent',
    'aria-label': 'Toggle switch',
  },
};

export const SmallSize: Story = {
  render: (args) => <ToggleWithState {...args} />,
  args: {
    size: 'sm',
    variant: 'accent',
    'aria-label': 'Small toggle',
  },
};

export const MediumSize: Story = {
  render: (args) => <ToggleWithState {...args} />,
  args: {
    size: 'md',
    variant: 'accent',
    'aria-label': 'Medium toggle',
  },
};

export const LargeSize: Story = {
  render: (args) => <ToggleWithState {...args} />,
  args: {
    size: 'lg',
    variant: 'accent',
    'aria-label': 'Large toggle',
  },
};

export const Success: Story = {
  render: (args) => <ToggleWithState {...args} />,
  args: {
    size: 'lg',
    variant: 'success',
    checked: true,
    'aria-label': 'Success toggle',
  },
};

export const Danger: Story = {
  render: (args) => <ToggleWithState {...args} />,
  args: {
    size: 'lg',
    variant: 'danger',
    checked: true,
    'aria-label': 'Danger toggle',
  },
};

export const Warning: Story = {
  render: (args) => <ToggleWithState {...args} />,
  args: {
    size: 'lg',
    variant: 'warning',
    checked: true,
    'aria-label': 'Warning toggle',
  },
};

export const Disabled: Story = {
  render: (args) => <ToggleWithState {...args} />,
  args: {
    size: 'lg',
    variant: 'accent',
    disabled: true,
    'aria-label': 'Disabled toggle',
  },
};

export const DisabledChecked: Story = {
  render: (args) => <ToggleWithState {...args} />,
  args: {
    size: 'lg',
    variant: 'accent',
    disabled: true,
    checked: true,
    'aria-label': 'Disabled checked toggle',
  },
};
