import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Switch from './Switch';

const meta = {
  title: 'Interactive/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

const SwitchWithState = (args: any) => {
  const [value, setValue] = useState(args.value);
  return <Switch {...args} value={value} onChange={setValue} />;
};

export const TwoOptions: Story = {
  render: (args) => <SwitchWithState {...args} />,
  args: {
    options: [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
    ],
    value: 'opt1',
  },
};

export const ThreeOptions: Story = {
  render: (args) => <SwitchWithState {...args} />,
  args: {
    options: [
      { label: 'Small', value: 'sm' },
      { label: 'Medium', value: 'md' },
      { label: 'Large', value: 'lg' },
    ],
    value: 'md',
  },
};

export const WithIcons: Story = {
  render: (args) => <SwitchWithState {...args} />,
  args: {
    options: [
      { label: <i className="fas fa-sun" />, value: 'light' },
      { label: <i className="fas fa-moon" />, value: 'dark' },
    ],
    value: 'light',
  },
};

export const WithError: Story = {
  render: (args) => <SwitchWithState {...args} />,
  args: {
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    value: 'yes',
    error: 'Please select an option',
  },
};
