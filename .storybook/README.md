# Storybook for @kacker/ui

This directory contains Storybook configuration and component stories for the @kacker/ui library.

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Installation

Install dependencies:
```bash
npm install --legacy-peer-deps
```

### Running Storybook

Start the Storybook development server:
```bash
npm run storybook
```

This will start Storybook on http://localhost:6006

### Building Storybook

Build a static version of Storybook:
```bash
npm run build-storybook
```

The static site will be generated in the `storybook-static` directory.

## About the Mocks

The `.storybook/mocks` directory contains mock implementations of Capacitor dependencies. These are required because the @kacker/ui library has peer dependencies on various Capacitor plugins that are only available in native mobile environments.

The mocks allow Storybook to run in a web browser while maintaining compatibility with the library's code structure.

## Component Stories

Stories are organized by component type:

- **Components/** - Core UI components (Image, Page, etc.)
- **Interactive/** - Interactive form components (Button, Input, Switch, Select, TextArea, Toggle, Form, etc.)

Each story file demonstrates multiple variants and states of the component, making it easy to:
- Visualize all component variations
- Test component behavior interactively
- Generate documentation automatically
- Develop components in isolation

## Adding New Stories

To add a story for a new component:

1. Create a `.stories.tsx` file next to your component:
   ```typescript
   import type { Meta, StoryObj } from '@storybook/react';
   import YourComponent from './YourComponent';

   const meta = {
     title: 'Category/YourComponent',
     component: YourComponent,
     parameters: {
       layout: 'centered',
     },
     tags: ['autodocs'],
   } satisfies Meta<typeof YourComponent>;

   export default meta;
   type Story = StoryObj<typeof meta>;

   export const Default: Story = {
     args: {
       // your props here
     },
   };
   ```

2. Storybook will automatically detect and display your new story.

## Configuration

- `.storybook/main.ts` - Main Storybook configuration
- `.storybook/preview.ts` - Global preview configuration and decorators
- `.storybook/mocks/` - Mock implementations for Capacitor dependencies

## Learn More

- [Storybook Documentation](https://storybook.js.org/docs)
- [Writing Stories](https://storybook.js.org/docs/writing-stories)
- [Storybook Addons](https://storybook.js.org/addons)
