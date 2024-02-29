'use client';

import { signOut } from 'next-auth/react';

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  return (
    <span
      onClick={async () => {
        await signOut();
      }}
      className="cursor-pointer"
    >
      {children}
    </span>
  );
};
