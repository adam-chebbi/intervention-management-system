import Link from 'next/link';

export function PublicFooter() {
    return (
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-background">
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()}. Tous droits réservés. Réalisé par Adam Chebbi</p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                <Link href="/mentions-legales" className="text-xs hover:underline underline-offset-4" prefetch={false}>
                    Mentions Légales
                </Link>
            </nav>
        </footer>
    )
}
