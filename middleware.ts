import { withAuth } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from '@/routes';

export default withAuth(
  async function middleware(req) {
    const { nextUrl } = req;
    const pathname = req.nextUrl.pathname;
    const isLoggedIn = !!req.nextauth.token;
    const token = await getToken({ req });
    console.log('-----------------------');
    console.log('isLoggedIn', isLoggedIn);
    console.log('req.nextauth.token', req.nextauth.token);
    console.log('req.nextUrl.pathname', pathname);
    // console.log('req.nextauth.session', req.nextauth.session?.user?.role);
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    // console.log('isAuthRoute', isAuthRoute);
    let callbackUrl = nextUrl.pathname;
    console.log('callbackUrl:', callbackUrl);

    // if (nextUrl.pathname == '/auth/signin') {
    // if (nextUrl.pathname.startsWith('/auth')) {
    //   console.log("nextUrl.pathname.startsWith('/auth')");
    //   if (isLoggedIn) {
    //     return NextResponse.redirect('http://localhost:3000/');
    //   }
    //   return null;
    // }

    if (isApiAuthRoute) {
      return null;
    }

    if (isAuthRoute) {
      if (isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      return null;
    }

    if (!isLoggedIn && !isPublicRoute) {
      let callbackUrl = nextUrl.pathname;
      if (nextUrl.search) {
        callbackUrl += nextUrl.search;
      }

      const encodedCallbackUrl = encodeURIComponent(callbackUrl);

      return Response.redirect(
        new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
      );
    }
    return null;
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized: () => {
        console.log('run');
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
