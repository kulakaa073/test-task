'use client';
import { Form } from '@heroui/form';
import { Button, Input } from '@heroui/react';

export const LoginForm = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    console.log(data.email);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        isRequired
        name="email"
        label="Email"
        labelPlacement={undefined}
        placeholder="mail"
        validate={(value) => {
          if (
            !value.match('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
          ) {
            return 'Enter valid email!';
          }
        }}
      />
      <Button type="submit">Continue with Email</Button>
    </Form>
  );
};
