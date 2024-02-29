'use client';

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
import GoogleSignInButton from './GoogleSignInButton';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { FormSchema } from '@/app/schemas';
import { signIn } from 'next-auth/react';

interface Props {
  callbackUrl?: string;
}

type InputType = z.infer<typeof FormSchema>;

const SignInForm = (props: Props) => {
  let callbackUrl = props.callbackUrl ? props.callbackUrl : '/';
  const router = useRouter();
  const form = useForm<InputType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (!result?.ok) {
      toast.error(result?.error);
      return;
    }
    toast.success('Welcome back!');

    router.push(callbackUrl);
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            {/* <form className="w-full"> */}
            <div className="space-y-2">
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
            </div>
            <Button className="w-full mt-6 " type="submit">
              Sign in
            </Button>
          </form>
          <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
            or
          </div>
          <GoogleSignInButton callbackUrl={callbackUrl}>
            Sign in with Google
          </GoogleSignInButton>
          <p className="text-center text-sm text-gray-600 mt-2">
            If you don&apos;t have an account, please&nbsp;
            <Link className="text-blue-500 hover:underline" href="/auth/signup">
              Sign up
            </Link>
          </p>
          <p className="text-center text-sm text-blue-500 mt-2">
            <Link href={'/auth/forgotPassword'}>Forgot Your Password?</Link>
          </p>
        </Form>
      </Card>
    </div>
  );
};

export default SignInForm;
