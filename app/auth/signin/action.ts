// 'use server';

// import { FormSchema } from '@/app/schemas';
// import * as z from 'zod';
// import { signIn } from 'next-auth/react';
// import prisma from '@/prisma/client';
// import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

// export const login = async (
//   data: z.infer<typeof FormSchema>,
//   callbackUrl?: string | null
// ) => {
//   const validatedFields = FormSchema.safeParse(data);

//   if (!validatedFields.success) {
//     return { error: 'Invalid fields!' };
//   }

//   const { email, password } = validatedFields.data;

//   const existingUser = await prisma.user.findUnique({ where: { email } });

//   if (!existingUser || !existingUser.email || !existingUser.hashedPassword) {
//     return { error: 'Email does not exist!' };
//   }

//   try {
//     await signIn('credentials', {
//       email,
//       password,
//       redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
//     });
//   } catch (error) {
//     // if (error instanceof AuthError) {
//     //   switch (error.type) {
//     //     case 'CredentialsSignin':
//     //       return { error: 'Invalid credentials!' };
//     //     default:
//     //       return { error: 'Something went wrong!' };
//     //   }
//     // }

//     throw error;
//   }
// };
