import { Button } from '@/components/ui/button';
import { Bolt, LogIn, Mail, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <PublicHeader />
      <main className="flex-1">
        <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center bg-primary">
            <Image
                src="/assets/hero-background.png"
                alt="City skyline with energy infrastructure"
                fill
                className="object-cover -z-10 opacity-20"
                data-ai-hint="skyline city"
                priority
             />
             <div className="container px-4 md:px-6 text-white">
                <div className="flex flex-col items-center space-y-6">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                        Plateforme interne de gestion des interventions
                    </h1>
                     <p className="mx-auto max-w-[700px] text-lg md:text-xl">
                        Un problème ou une demande ? Signalez-le nous directement en ligne.
                    </p>
                    <Button size="lg" asChild>
                         <Link href="/signaler" prefetch={false}>
                            <Send className="mr-2 h-5 w-5" />
                           Signaler une intervention
                        </Link>
                    </Button>
                </div>
             </div>
        </section>
        
        <section id="mission" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-3">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-semibold">Notre Mission</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Efficacité, Suivi et Organisation</h2>
                <p className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Notre plateforme centralise et simplifie la gestion des interventions techniques et administratives. Elle est conçue pour améliorer l'efficacité opérationnelle, assurer un suivi en temps réel et optimiser l'organisation des équipes sur le terrain.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <PublicFooter />
    </div>
  );
}
