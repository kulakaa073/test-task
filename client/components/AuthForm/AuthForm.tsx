'use client';
import api from '@/lib/api/axios';
import { Button, Input, Tooltip, Link, addToast } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion';
import { AxiosError } from 'axios';

export const AuthForm = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState(false);
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'signup';

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);

  const resetForm = () => {
    setPage([0, 0]);
    setEmail('');
    setPassword('');
    setIsPasswordVisible(false);
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
    setError(false);
    setPassword(value);
  };
  const handleConfirmPasswordChange = (value: string) => {
    setError(false);
    setConfirmPassword(value);
  };

  const handleEmailSubmit = () => {
    const isValid = validateEmail(email);
    if (!isValid) {
      setError(true);
      return;
    }
    paginate(1);
  };

  const handlePasswordSubmit = () => {
    const isValid = validatePassword(email);
    if (!isValid) {
      setError(true);
      return;
    }
    setIsPasswordVisible(false);
    paginate(1);
  };

  const handleConfirmPasswordSubmit = () => {
    const isValid = password === confirmPassword;
    if (!isValid) {
      setError(true);
      return;
    }
    handleSubmitData();
  };

  const handleSubmitData = async () => {
    const data = { email: email, password: password };
    console.log(data);
    try {
      let response;
      if (mode === 'login') {
        response = await api.post('/auth/login', data);
        addToast({
          title: 'Success',
          description: 'Logged in successfully',
          color: 'success',
        });
      }
      if (mode === 'signup') {
        response = await api.post('/auth/register', data);
        addToast({
          title: 'Success',
          description: 'Registered successfully',
          color: 'success',
        });
      }
      console.log(response);
      resetForm();
    } catch (error: any) {
      console.log(error);
      addToast({
        title: 'Error',
        description: error.response.data.errors || error.response.data.message,
        color: 'danger',
      });
    }
  };

  const buttonLabel = [
    'Continue with Email',
    'Enter Password',
    'Confirm Password',
  ];

  const handleSubmit = () => {
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

  const Title = useCallback(
    (props: React.PropsWithChildren<{}>) => (
      <m.h1
        animate={{ opacity: 1, x: 0 }}
        className="text-xl font-medium text-text"
        exit={{ opacity: 0, x: -10 }}
        initial={{ opacity: 0, x: -10 }}
      >
        {props.children}
      </m.h1>
    ),

    [page],
  );

  const titleContent = useMemo(() => {
    let title;
    switch (page) {
      case 0: {
        title = mode === 'signup' ? 'Sign Up' : 'Log in';
        break;
      }
      case 1: {
        title = 'Enter Password';
        break;
      }
      case 2: {
        title = 'Confirm Password';
        break;
      }
      default: {
        break;
      }
    }
    return title;
  }, [page]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div
      className="flex w-full max-w-sm flex-col gap-4 overflow-hidden rounded-large px-8 pb-10 pt-6 
    shadow-[0px_0px_1px_0px_#FFFFFF26_inset,0px_2px_10px_0px_#00000033,0px_0px_5px_0px_#0000000D] bg-gray-900"
    >
      <LazyMotion features={domAnimation}>
        <m.div className="flex min-h-[40px] items-center gap-2 pb-2">
          <AnimatePresence initial={false} mode="popLayout">
            {page >= 1 && (
              <m.div
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                initial={{ opacity: 0, x: -10 }}
              >
                <Tooltip content="Go back" delay={3000}>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    onPress={() => paginate(-1)}
                  >
                    <Icon
                      className="text-default-500"
                      icon="solar:alt-arrow-left-linear"
                      width={16}
                    />
                  </Button>
                </Tooltip>
              </m.div>
            )}
          </AnimatePresence>

          <AnimatePresence custom={direction} initial={false} mode="wait">
            <Title>{titleContent}</Title>
          </AnimatePresence>
        </m.div>

        <AnimatePresence custom={direction} initial={false} mode="wait">
          <m.form
            key={page}
            animate="center"
            className="flex flex-col gap-3"
            custom={direction}
            exit="exit"
            initial="enter"
            transition={{ duration: 0.2 }}
            variants={variants}
            onSubmit={handleSubmit}
          >
            {page === 0 && (
              <Input
                isRequired
                name="email"
                label="mail"
                autoFocus
                onValueChange={handleEmailChange}
                onKeyUp={(event) =>
                  event.key === 'Enter' && handleEmailSubmit()
                }
                isInvalid={error}
                labelPlacement="inside"
              />
            )}
            {page === 1 && (
              <Input
                isRequired
                name="password"
                label="Password"
                type={isPasswordVisible ? 'text' : 'password'}
                autoFocus
                onValueChange={handlePasswordChange}
                onKeyUp={(event) =>
                  event.key === 'Enter' && handlePasswordSubmit()
                }
                isInvalid={error}
                labelPlacement="inside"
                endContent={
                  <button type="button" onClick={togglePasswordVisibility}>
                    {isPasswordVisible ? (
                      <Icon
                        className="pointer-events-none text-2xl text-default-400"
                        icon="solar:eye-closed-linear"
                      />
                    ) : (
                      <Icon
                        className="pointer-events-none text-2xl text-default-400"
                        icon="solar:eye-bold"
                      />
                    )}
                  </button>
                }
              />
            )}
            {page === 2 && (
              <Input
                isRequired
                name="confirmPassword"
                label="Confirm password"
                type={isPasswordVisible ? 'text' : 'password'}
                autoFocus
                onValueChange={handleConfirmPasswordChange}
                onKeyUp={(event) =>
                  event.key === 'Enter' && handleConfirmPasswordSubmit()
                }
                isInvalid={error}
                labelPlacement="inside"
                endContent={
                  <button type="button" onClick={togglePasswordVisibility}>
                    {isPasswordVisible ? (
                      <Icon
                        className="pointer-events-none text-2xl text-default-400"
                        icon="solar:eye-closed-linear"
                      />
                    ) : (
                      <Icon
                        className="pointer-events-none text-2xl text-default-400"
                        icon="solar:eye-bold"
                      />
                    )}
                  </button>
                }
              />
            )}
            <Button type="button" onPress={handleSubmit} color="primary">
              {buttonLabel[page]}
            </Button>
          </m.form>
        </AnimatePresence>
      </LazyMotion>

      <p className="text-center text-small">
        Already have an account?&nbsp;
        <Link
          href={`/form?mode=${mode === 'login' ? 'signup' : 'login'}`}
          size="sm"
        >
          {mode === 'login' ? 'Sign up' : 'Log in'}
        </Link>
      </p>
    </div>
  );
};
