import { Button } from '@/components/ui/button';
import { LogIn, Send } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/assets/logo-32x32.png';

export function PublicHeader() {
    return (
        <header className="px-4 lg:px-6 h-16 flex items-center bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
            <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
                <Image src={Logo} alt="Logo" width={28} height={28} className="text-primary" />
                <span className="font-bold text-lg text-primary"></span>
            </Link>
            <nav className="ml-auto flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" asChild>
                <Link href="/signaler" prefetch={false}>
                    <Send className="mr-2 h-4 w-4" />
                    Signaler
                </Link>
            </Button>
             <Link
                href="/contact"
                className="text-sm font-medium hover:underline underline-offset-4 hidden sm:block"
                prefetch={false}
            >
                Contact
            </Link>
            <Button asChild>
                <Link href="/login" prefetch={false}>
                <LogIn className="mr-2 h-4 w-4" />
                Connexion
                </Link>
            </Button>
            </nav>
        </header>
    )
}
