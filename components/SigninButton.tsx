'use client';

import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from './ui/button';
import { LogOut, User } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { LogoutButton } from './logout-button';

const SigninButton = () => {
  const { data: session } = useSession();
  console.log(session);

  return (
    <div className="flex items-center gap-2 ">
      {session && session.user ? (
        <>
          {/* <Link
            href={'/profile'}
          >{`${session.user.firstName} ${session.user.lastName}`}</Link> */}

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={session.user?.image || ''} />
                <AvatarFallback className="bg-sky-500">
                  <User className="text-white" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}

            <DropdownMenuContent className="w-60" align="end">
              <DropdownMenuItem>{`${session.user.email}`}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link href="/profile">
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </Link>
              <LogoutButton>
                <DropdownMenuItem>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </LogoutButton>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Button onClick={() => signIn()}>Sign In</Button>
          <Link href={'/auth/signup'}>Sign Up</Link>
        </>
      )}
    </div>
  );
};

export default SigninButton;
