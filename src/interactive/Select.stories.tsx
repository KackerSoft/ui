import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Select from './Select';

const meta = {
  title: 'Interactive/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const SelectWithState = (args: any) => {
  const [value, setValue] = useState(args.value);
  return <Select {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  render: (args) => <SelectWithState {...args} />,
  args: {
    placeholder: 'Choose an option',
    options: [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
      { label: 'Option 3', value: 'opt3' },
    ],
  },
};

export const WithValue: Story = {
  render: (args) => <SelectWithState {...args} />,
  args: {
    placeholder: 'Select size',
    value: 'md',
    options: [
      { label: 'Small', value: 'sm' },
      { label: 'Medium', value: 'md' },
      { label: 'Large', value: 'lg' },
    ],
  },
};

export const ManyOptions: Story = {
  render: (args) => <SelectWithState {...args} />,
  args: {
    placeholder: 'Select country',
    options: [
      { label: 'United States', value: 'us' },
      { label: 'United Kingdom', value: 'uk' },
      { label: 'Canada', value: 'ca' },
      { label: 'Australia', value: 'au' },
      { label: 'Germany', value: 'de' },
      { label: 'France', value: 'fr' },
      { label: 'Italy', value: 'it' },
      { label: 'Spain', value: 'es' },
      { label: 'Japan', value: 'jp' },
      { label: 'China', value: 'cn' },
      { label: 'India', value: 'in' },
      { label: 'Brazil', value: 'br' },
    ],
  },
};

export const WithError: Story = {
  render: (args) => <SelectWithState {...args} />,
  args: {
    placeholder: 'Select an option',
    error: 'This field is required',
    options: [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
    ],
  },
};
