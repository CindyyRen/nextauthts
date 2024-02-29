import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { FC, ReactNode } from 'react';
import google from '@/public/google.svg';
import Image from 'next/image';
interface GoogleSignInButtonProps {
  children: ReactNode;
  callbackUrl: string;
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({
  children,
  callbackUrl,
}) => {
  const loginWithGoogle = async () => {
    const result = await signIn('google', {
      callbackUrl,
    });
    console.log({ result });
  };

  return (
    <Button
      onClick={loginWithGoogle}
      className="w-full bg-neutral-600 hover:bg-neutral-500"
    >
      {children}
      <Image
        src={google}
        width={40}
        height={40}
        alt="google"
        className="pl-3"
      />
    </Button>
  );
};

export default GoogleSignInButton;
