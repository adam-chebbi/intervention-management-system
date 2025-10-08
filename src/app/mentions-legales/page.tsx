import Link from 'next/link';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';

export default function LegalPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
        <PublicHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
          <div className="prose prose-lg max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Mentions Légales</h1>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Éditeur du site</h2>
            <p>
              Ce site est une application de démonstration créée à des fins d'illustration.
            </p>
            <p>
              <strong>Société :</strong> Demo <br />
              <strong>Adresse :</strong> 38 Rue Kamel Ataturk, Tunis, Tunisie (adresse fictive pour la démo)<br />
              <strong>Capital social :</strong> Fictif<br />
              <strong>Directeur de la publication :</strong> Un personnage fictif
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Hébergement</h2>
            <p>
              L'application est hébergée sur une plateforme cloud. Les informations relatives à l'hébergeur réel ne sont pas divulguées pour cette version de démonstration.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Propriété intellectuelle</h2>
            <p>
              Toute reproduction, même partielle, est interdite. Les contenus textuels et les images de cette application de démonstration sont générés ou proviennent de sources libres de droits (par exemple, Picsum Photos) et sont utilisés à des fins purement illustratives.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Données personnelles</h2>
            <p>
              Cette application est une démonstration et ne collecte, ne traite et ne stocke aucune donnée personnelle réelle. Les informations saisies dans les formulaires (connexion, création d'intervention, contact) sont uniquement utilisées pour simuler le fonctionnement de l'application et ne sont pas conservées.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Limitation de responsabilité</h2>
            <p>
              Cette application est un prototype non fonctionnel. Elle ne doit en aucun cas être utilisée pour une gestion réelle d'interventions. L'éditeur de cette démonstration décline toute responsabilité quant à l'utilisation qui pourrait être faite des informations présentées, qui sont purement fictives.
            </p>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
