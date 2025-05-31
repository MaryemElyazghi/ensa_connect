"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import type { TutoringRequest } from '@/lib/types';
import { AlertCircle, PlusCircle, ListChecks, History, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Mock data for student's requests
const mockRequests: TutoringRequest[] = [
  {
    id: 'req1', studentId: 'student123', studentName: 'Alice Étudiante', subject: 'Algorithmique', level: '3ème année',
    description: 'Besoin d\'aide sur les graphes.', studentAvailability: 'Lundi soir', status: 'matched',
    tutorId: 'tutor456', tutorName: 'Bob Tuteur', scheduledTime: '2024-07-29T18:00:00Z', createdAt: '2024-07-25T10:00:00Z'
  },
  {
    id: 'req2', studentId: 'student123', studentName: 'Alice Étudiante', subject: 'Compilation', level: '3ème année',
    description: 'Comprendre les analyseurs syntaxiques.', studentAvailability: 'Mercredi après-midi', status: 'pending',
    createdAt: '2024-07-26T14:30:00Z'
  },
  {
    id: 'req3', studentId: 'student123', studentName: 'Alice Étudiante', subject: 'Bases de données', level: '2ème année',
    description: 'Révision pour partiel.', studentAvailability: 'Weekend', status: 'completed',
    tutorId: 'tutor2', tutorName: 'Marcus Chen', scheduledTime: '2024-07-20T10:00:00Z', createdAt: '2024-07-15T09:00:00Z'
  },
];


export default function StudentDashboardPage() {
  const { user } = useAuth();

  if (!user || user.role !== 'student') {
    return (
      <DashboardLayout>
         <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Accès non autorisé</AlertTitle>
          <AlertDescription>Cette page est réservée aux étudiants.</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  const upcomingSessions = mockRequests.filter(r => r.status === 'matched' || r.status === 'active');
  const pendingRequests = mockRequests.filter(r => r.status === 'pending');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section>
          <h1 className="font-headline text-3xl font-bold text-foreground mb-2">Tableau de bord Étudiant</h1>
          <p className="text-muted-foreground">Bienvenue, {user.name} ! Gérez vos demandes de tutorat et suivez vos progrès.</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Demandes en attente</CardTitle>
              <ListChecks className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests.length}</div>
              <p className="text-xs text-muted-foreground">
                {pendingRequests.length > 0 ? "En attente d'un tuteur" : "Aucune demande en attente"}
              </p>
            </CardContent>
          </Card>
           <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions à venir</CardTitle>
              <ListChecks className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingSessions.length}</div>
              <p className="text-xs text-muted-foreground">
                {upcomingSessions.length > 0 ? "Sessions planifiées avec un tuteur" : "Aucune session à venir"}
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Nouvelle demande de tutorat</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-primary-foreground/80 mb-4">Besoin d'aide dans une matière ? Soumettez une nouvelle demande.</CardDescription>
              <Button variant="secondary" asChild className="w-full">
                <Link href="/dashboard/student/new-request">
                  <PlusCircle className="mr-2 h-4 w-4" /> Faire une demande
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
        
        {upcomingSessions.length > 0 && (
          <section>
            <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">Vos prochaines sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingSessions.map(req => (
                <Card key={req.id} className="shadow-sm">
                  <CardHeader>
                    <CardTitle>{req.subject}</CardTitle>
                    <CardDescription>Avec {req.tutorName} - Le {new Date(req.scheduledTime!).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">Niveau: {req.level}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">Description: {req.description}</p>
                  </CardContent>
                  <CardFooter>
                     <Button variant="outline" size="sm" asChild>
                        <Link href={`/session-feedback?session=${req.id}`}>Donner un feedback (après session)</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}

        {mockRequests.filter(r => r.status === 'completed').length > 0 && (
           <section>
            <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">Historique des sessions</h2>
             <div className="space-y-4">
                {mockRequests.filter(r => r.status === 'completed').map(req => (
                    <Card key={req.id} className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">{req.subject}</CardTitle>
                            <CardDescription>Session avec {req.tutorName} - Terminée le {new Date(req.scheduledTime!).toLocaleDateString('fr-FR')}</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-between items-center">
                            <Link href={`/session-feedback?session=${req.id}&view=true`} className="text-sm text-primary hover:underline">
                                Voir le feedback
                            </Link>
                            {/* Mock rating display */}
                            <div className="flex items-center">
                                {[...Array(Math.floor(Math.random() * 2) + 4)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>
                        </CardFooter>
                    </Card>
                ))}
             </div>
          </section>
        )}


        {!upcomingSessions.length && !pendingRequests.length && mockRequests.filter(r => r.status === 'completed').length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Image src="https://placehold.co/300x200.png" alt="No requests" width={300} height={200} className="mx-auto mb-6 rounded-md" data-ai-hint="empty state illustration" />
                <h3 className="text-xl font-semibold mb-2">Aucune activité pour le moment</h3>
                <p className="text-muted-foreground mb-4">Commencez par faire une demande de tutorat pour trouver de l'aide.</p>
                <Button asChild>
                  <Link href="/dashboard/student/new-request"><PlusCircle className="mr-2 h-4 w-4" />Nouvelle demande</Link>
                </Button>
              </CardContent>
            </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
