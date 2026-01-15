import type { Meta, StoryObj } from '@storybook/react';
import Page, { PageHeader } from './page';

const meta = {
  title: 'Components/Page',
  component: Page,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-4">
        <PageHeader>Welcome</PageHeader>
        <p className="mt-4">This is a basic page layout.</p>
      </div>
    ),
  },
};

export const WithHeader: Story = {
  args: {
    header: {
      title: 'Settings',
    },
    children: (
      <div className="p-4">
        <p>Page content goes here.</p>
        <p className="mt-4">This page has a header with a back button.</p>
      </div>
    ),
  },
};

export const WithHeaderAndAction: Story = {
  args: {
    header: {
      title: 'Profile',
      action: <button className="px-3 py-1 bg-accent-500 rounded-lg">Edit</button>,
    },
    children: (
      <div className="p-4">
        <PageHeader>User Profile</PageHeader>
        <p className="mt-4">Username: johndoe</p>
        <p className="mt-2">Email: john@example.com</p>
      </div>
    ),
  },
};

export const LongContent: Story = {
  args: {
    header: {
      title: 'Article',
    },
    children: (
      <div className="p-4 space-y-4">
        <PageHeader>Long Article Title</PageHeader>
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i}>
            This is paragraph {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        ))}
      </div>
    ),
  },
};
