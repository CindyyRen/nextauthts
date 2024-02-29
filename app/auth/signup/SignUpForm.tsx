'use client';

import { SubmitHandler, useForm } from 'react-hook-form';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { SignUpFormSchema } from '@/app/schemas';

import { toast } from 'react-toastify';
import { registerUser } from './action';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Props } from 'next/script';

const SignUpForm = (props: Props) => {
  let callbackUrl = props.callbackUrl ? props.callbackUrl : '/';
  const router = useRouter();
  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      // username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const saveUser = async (data: z.infer<typeof SignUpFormSchema>) => {
    const { confirmPassword, ...user } = data;
    try {
      const result = await registerUser(user);
      if (result.success) {
        toast('successfully signed up');
        router.push('/auth/signin');
        await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password,
        });
        router.push(callbackUrl);
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'Email already exists') {
        toast.error('Email already exists!');
      } else {
        toast.error('Something went wrong!');
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-10 pt-5">
        <CardHeader>
          <CardTitle className="flex justify-center">Academic Jobs</CardTitle>
          {/* <CardDescription className="flex justify-center">
            Sign in
          </CardDescription> */}
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(saveUser)} className="w-full">
            <div className="space-y-2">
              {/* <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="mail@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Re-Enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button className="w-full mt-6" type="submit">
              Sign up
            </Button>
          </form>
          <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
            or
          </div>
          {/* <GoogleSignInButton>Sign up with Google</GoogleSignInButton> */}
          <p className="text-center text-sm text-gray-600 mt-2">
            Already have an account? please&nbsp;
            <Link className="text-blue-500 hover:underline" href="/auth/signin">
              Sign in
            </Link>
          </p>
        </Form>
      </Card>
    </div>
  );
};

export default SignUpForm;
