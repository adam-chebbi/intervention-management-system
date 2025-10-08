import Image from 'next/image';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/assets/logo-32x32.png';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <Link href="/" className="inline-block mb-4" prefetch={false}>
              <Image src={Logo} alt="Logo" width={40} height={40} className="mx-auto" />
            </Link>
            <CardTitle className="text-2xl font-bold">Intervention Manager</CardTitle>
            <CardDescription>Accès réservé aux employés autorisés.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
