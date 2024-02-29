import prisma from '@/prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { FormSchema } from '@/app/schemas';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    // jwt: true,
    strategy: 'jwt',
    // strategy: 'database',
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
    // updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      idToken: true,

      authorization: {
        params: {
          scope: 'openid profile email',
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          // name: `${profile.given_name} ${profile.family_name}`,
          email: profile.email,
          image: profile.picture,
          userRole: 'JOBSEEKER',
        };
      },
    }),
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        email: {
          label: 'User Name',
          type: 'text',
          placeholder: 'Your User Name',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        console.log('credentials', credentials);

        const validatedFields = FormSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (!user) throw new Error('User name or password is not correct');

          // This is Naive Way of Comparing The Passwords
          // const isPassowrdCorrect = credentials?.password === user.password;
          if (!password) throw new Error('Please Provide Your Password');
          const passwordsMatch = await bcrypt.compare(
            password!,
            user.hashedPassword!
          );
          // alert(passwordsMatch);

          if (!passwordsMatch)
            throw new Error('User name or password is not correct');

          // if (!user.emailVerified)
          //   throw new Error('Please verify your email first!');
          user.userRole = 'EMPLOYER';
          const { hashedPassword, ...userWithoutPass } = user;
          // console.log('userWithoutPass', userWithoutPass);
          return userWithoutPass as User;
        }
        throw new Error('Invalid credentials');
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user as User;
      // console.log('jwttoken', token);
      return token;
    },

    async session({ token, session }) {
      session.user = token.user;
      // console.log(session);
      return session;
    },
  },
};
