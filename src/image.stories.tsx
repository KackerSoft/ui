import type { Meta, StoryObj } from '@storybook/react';
import Image from './image';

const meta = {
  title: 'Components/Image',
  component: Image,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: 'https://picsum.photos/400/300',
    alt: 'Sample image',
    className: 'w-96 h-64 object-cover rounded-lg',
  },
};

export const WithPlaceholder: Story = {
  args: {
    src: 'https://picsum.photos/400/300?random=1',
    alt: 'Image with placeholder',
    className: 'w-96 h-64 object-cover rounded-lg',
  },
};

export const Square: Story = {
  args: {
    src: 'https://picsum.photos/300/300',
    alt: 'Square image',
    className: 'w-64 h-64 object-cover rounded-lg',
  },
};

export const Circular: Story = {
  args: {
    src: 'https://picsum.photos/200/200?random=2',
    alt: 'Circular image',
    className: 'w-32 h-32 object-cover rounded-full',
  },
};
