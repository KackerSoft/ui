import type { Meta, StoryObj } from '@storybook/react';
import Form from './form';
import Input from './Input';
import Button from './buttons/Button';

const meta = {
  title: 'Interactive/Form',
  component: Form,
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
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm: Story = {
  render: () => (
    <Form<LoginFormData>
      initialData={{ email: '', password: '' }}
      onSubmit={(data) => {
        console.log('Form submitted:', data);
        alert(`Logged in with: ${data.email}`);
      }}
      validate={(data) => {
        if (!data.email || !data.password) {
          throw { all: 'All fields are required' };
        }
        if (!data.email.includes('@')) {
          throw { email: 'Invalid email address' };
        }
        return true;
      }}
    >
      {({ errors, data, setField, submit }) => (
        <>
          <Input
            placeholder="Email"
            value={data.email}
            onChange={(e) => setField('email', e.target.value)}
            error={errors.email}
            type="email"
          />
          <Input
            placeholder="Password"
            value={data.password}
            onChange={(e) => setField('password', e.target.value)}
            error={errors.password}
            type="password"
          />
          {errors.all && <div className="text-red-500 text-sm">{errors.all}</div>}
          <Button variant="accent" type="submit">
            Login
          </Button>
        </>
      )}
    </Form>
  ),
};

interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const SignupForm: Story = {
  render: () => (
    <Form<SignupFormData>
      initialData={{ username: '', email: '', password: '', confirmPassword: '' }}
      onSubmit={(data) => {
        console.log('Signup form submitted:', data);
        alert(`Account created for: ${data.username}`);
      }}
      validate={(data) => {
        if (!data.username || !data.email || !data.password || !data.confirmPassword) {
          throw { all: 'All fields are required' };
        }
        if (data.password !== data.confirmPassword) {
          throw { confirmPassword: 'Passwords do not match' };
        }
        return true;
      }}
    >
      {({ errors, data, setField }) => (
        <>
          <Input
            placeholder="Username"
            value={data.username}
            onChange={(e) => setField('username', e.target.value)}
            error={errors.username}
          />
          <Input
            placeholder="Email"
            value={data.email}
            onChange={(e) => setField('email', e.target.value)}
            error={errors.email}
            type="email"
          />
          <Input
            placeholder="Password"
            value={data.password}
            onChange={(e) => setField('password', e.target.value)}
            error={errors.password}
            type="password"
          />
          <Input
            placeholder="Confirm Password"
            value={data.confirmPassword}
            onChange={(e) => setField('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            type="password"
          />
          {errors.all && <div className="text-red-500 text-sm">{errors.all}</div>}
          <Button variant="accent" type="submit">
            Sign Up
          </Button>
        </>
      )}
    </Form>
  ),
};
