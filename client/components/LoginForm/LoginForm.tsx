'use client';
import { useDebounce } from '@/hooks/useDebounce';
import api from '@/lib/axios';
import { Form } from '@heroui/form';
import { Button, Input, PressEvent } from '@heroui/react';
import { useState } from 'react';

export const LoginForm = () => {
  const [page, setPage] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(false);

  const resetForm = () => {
    setPage(0);
    setEmail('');
    setPassword('');
    setError(false);
  };

  const validateEmail = (value: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(value);
  };

  const validatePassword = (value: string) => {
    return value.length > 8 && value.length < 128;
  };

  const handleEmailChange = (value: string) => {
    setError(false);
    setEmail(value);
  };
  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
  };

  const handleEmailSubmit = () => {
    const isValid = validateEmail(email);
    if (!isValid) {
      setError(true);
      return;
    }
    setPage(1);
  };

  const handlePasswordSubmit = () => {
    const isValid = validatePassword(email);
    if (!isValid) {
      setError(true);
      return;
    }
    setPage(2);
  };

  const handleConfirmPasswordSubmit = () => {
    const isValid = password === confirmPassword;
    if (!isValid) {
      setError(true);
      return;
    }
    handleSubmit();
  };

  const handleSubmit = async () => {
    const data = { email: email, password: password };
    console.log(data);
    try {
      const response = await api.post('/auth/register', data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const buttonLabel = [
    'Continue with Email',
    'Enter Password',
    'Confirm Password',
  ];

  const handleButtonPress = () => {
    switch (page) {
      case 0: {
        handleEmailSubmit();
        break;
      }
      case 1: {
        handlePasswordSubmit();
        break;
      }
      case 2: {
        handleConfirmPasswordSubmit();
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <Form>
      {page === 0 && (
        <Input
          isRequired
          name="email"
          label="Email"
          labelPlacement={undefined}
          placeholder="mail"
          autoFocus
          onValueChange={handleEmailChange}
          onKeyUp={(event) => event.key === 'Enter' && handleEmailSubmit()}
          isInvalid={error}
        />
      )}
      {page === 1 && (
        <Input
          isRequired
          name="password"
          label="Password"
          labelPlacement={undefined}
          placeholder="Password"
          autoFocus
          onValueChange={handlePasswordChange}
          onKeyUp={(event) => event.key === 'Enter' && handlePasswordSubmit()}
          isInvalid={error}
        />
      )}
      {page === 2 && (
        <Input
          isRequired
          name="confirmPassword"
          label="Confirm password"
          labelPlacement={undefined}
          placeholder="Confirm password"
          autoFocus
          onValueChange={handleConfirmPasswordChange}
          onKeyUp={(event) =>
            event.key === 'Enter' && handleConfirmPasswordSubmit()
          }
          isInvalid={error}
        />
      )}
      <Button type="button" onPress={handleButtonPress}>
        {buttonLabel[page]}
      </Button>
    </Form>
  );
};
