import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, MessageSquare, BarChart3 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Profils Étudiants & Tuteurs",
      description: "Inscrivez-vous facilement et gérez votre profil, que vous soyez étudiant cherchant de l'aide ou tuteur souhaitant partager vos connaissances.",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: "Matching Automatisé",
      description: "Notre système intelligent vous met en relation avec les tuteurs les plus compatibles en fonction de vos besoins et disponibilités.",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Communication Intégrée",
      description: "Échangez avec votre tuteur ou étudiant directement sur la plateforme pour planifier vos sessions et discuter des sujets.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Suivi & Feedback",
      description: "Suivez vos progrès, donnez votre avis sur les sessions et contribuez à l'amélioration continue de la plateforme.",
    },
  ];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Hero Section */}
        <section className="text-center mb-16 md:mb-24">
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
            Bienvenue sur <span className="text-primary">ENSA Connect</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Votre plateforme de tutorat académique pour mettre en relation étudiants et tuteurs qualifiés au sein de l'ENSA.
            Boostez votre réussite grâce à l'entraide !
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Commencer en tant qu'étudiant</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/signup?role=tutor">Devenir tuteur</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16 md:mb-24">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Pourquoi choisir ENSA Connect ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How it Works Section */}
        <section className="mb-16 md:mb-24">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center mb-2">
                  <span className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold mr-3">1</span>
                  <CardTitle className="font-headline text-lg">Inscrivez-vous</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Créez votre profil étudiant ou tuteur en quelques minutes.</p>
                <Image src="https://placehold.co/600x400.png" alt="Inscription" width={600} height={400} className="mt-4 rounded-md" data-ai-hint="registration form"/>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center mb-2">
                  <span className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold mr-3">2</span>
                  <CardTitle className="font-headline text-lg">Trouvez un match</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Les étudiants soumettent leurs besoins, les tuteurs sont proposés automatiquement.</p>
                 <Image src="https://placehold.co/600x400.png" alt="Matching" width={600} height={400} className="mt-4 rounded-md" data-ai-hint="connecting people"/>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center mb-2">
                  <span className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold mr-3">3</span>
                  <CardTitle className="font-headline text-lg">Apprenez & Progressez</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Planifiez vos sessions, collaborez et atteignez vos objectifs académiques.</p>
                <Image src="https://placehold.co/600x400.png" alt="Learning" width={600} height={400} className="mt-4 rounded-md" data-ai-hint="students learning"/>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-accent text-accent-foreground p-8 md:p-12 rounded-lg shadow-xl text-center">
          <h2 className="font-headline text-2xl md:text-3xl font-bold mb-4">
            Prêt à transformer votre parcours académique ?
          </h2>
          <p className="text-lg mb-6 max-w-xl mx-auto">
            Rejoignez la communauté ENSA Connect dès aujourd'hui et découvrez le pouvoir de l'apprentissage collaboratif.
          </p>
          <Button size="lg" variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href="/auth/signup">Inscrivez-vous gratuitement</Link>
          </Button>
        </section>
      </div>
    </AppLayout>
  );
}
