import type { Meta, StoryObj } from '@storybook/react';
import TextArea from './Textarea';

const meta = {
  title: 'Interactive/TextArea',
  component: TextArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
    rows: 4,
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter a description...',
    rows: 4,
  },
};

export const WithValue: Story = {
  args: {
    label: 'Comments',
    defaultValue: 'This is a sample comment that has been entered into the textarea.',
    rows: 4,
  },
};

export const WithError: Story = {
  args: {
    label: 'Message',
    placeholder: 'Enter your message...',
    error: 'Message is required',
    rows: 4,
  },
};

export const WithLeftIcon: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Enter notes...',
    left: <i className="fas fa-sticky-note" />,
    rows: 4,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Read only',
    defaultValue: 'This content cannot be edited',
    disabled: true,
    rows: 4,
  },
};

export const LargeTextArea: Story = {
  args: {
    label: 'Article',
    placeholder: 'Write your article here...',
    rows: 10,
  },
};
