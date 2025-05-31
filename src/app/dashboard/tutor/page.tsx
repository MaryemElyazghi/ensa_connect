"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import type { TutoringRequest } from '@/lib/types';
import { AlertCircle, CalendarClock, ListChecks, UserCheck, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Mock data for tutor's sessions/requests
const mockTutorSessions: TutoringRequest[] = [
  {
    id: 'req1', studentId: 'student123', studentName: 'Alice Étudiante', subject: 'Algorithmique', level: '3ème année',
    description: 'Besoin d\'aide sur les graphes.', studentAvailability: 'Lundi soir', status: 'active', // Active means accepted by tutor
    tutorId: 'tutor456', tutorName: 'Bob Tuteur', scheduledTime: '2024-07-29T18:00:00Z', createdAt: '2024-07-25T10:00:00Z'
  },
  {
    id: 'req4', studentId: 'student789', studentName: 'Charlie Apprenant', subject: 'Développement Web', level: '2ème année',
    description: 'Problèmes avec Flexbox en CSS.', studentAvailability: 'Jeudi matin', status: 'pending', // Pending for tutor to accept
    tutorId: 'tutor456', tutorName: 'Bob Tuteur', createdAt: '2024-07-27T11:00:00Z'
  },
   {
    id: 'req5', studentId: 'studentABC', studentName: 'Diana Codeuse', subject: 'Bases de Données', level: 'Master 1',
    description: 'Optimisation de requêtes SQL.', studentAvailability: 'Vendredi après-midi', status: 'completed',
    tutorId: 'tutor456', tutorName: 'Bob Tuteur', scheduledTime: '2024-07-19T15:00:00Z', createdAt: '2024-07-12T10:00:00Z'
  },
];

export default function TutorDashboardPage() {
  const { user } = useAuth();

  if (!user || user.role !== 'tutor') {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Accès non autorisé</AlertTitle>
          <AlertDescription>Cette page est réservée aux tuteurs.</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  const upcomingSessions = mockTutorSessions.filter(s => s.status === 'active');
  const pendingRequests = mockTutorSessions.filter(s => s.status === 'pending'); // Requests assigned to this tutor
  const totalStudentsHelped = new Set(mockTutorSessions.filter(s => s.status === 'completed').map(s => s.studentId)).size;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section>
          <h1 className="font-headline text-3xl font-bold text-foreground mb-2">Tableau de bord Tuteur</h1>
          <p className="text-muted-foreground">Bienvenue, {user.name} ! Gérez vos sessions de tutorat et disponibilités.</p>
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
                {pendingRequests.length > 0 ? "Nouvelles demandes à examiner" : "Aucune nouvelle demande"}
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions à venir</CardTitle>
              <CalendarClock className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingSessions.length}</div>
              <p className="text-xs text-muted-foreground">
                 {upcomingSessions.length > 0 ? "Sessions planifiées" : "Aucune session à venir"}
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Étudiants aidés</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudentsHelped}</div>
              <p className="text-xs text-muted-foreground">Nombre total d'étudiants uniques</p>
            </CardContent>
          </Card>
        </section>

        {pendingRequests.length > 0 && (
          <section>
            <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">Nouvelles demandes de tutorat</h2>
            <div className="space-y-4">
              {pendingRequests.map(req => (
                <Card key={req.id} className="shadow-sm">
                  <CardHeader>
                    <CardTitle>{req.subject} - {req.studentName}</CardTitle>
                    <CardDescription>Niveau: {req.level}. Disponibilités étudiant: {req.studentAvailability}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">Besoin: {req.description}</p>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button size="sm"><UserCheck className="mr-2 h-4 w-4"/> Accepter</Button>
                    <Button size="sm" variant="outline">Refuser</Button>
                    <Button size="sm" variant="ghost">Plus de détails</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}

        {upcomingSessions.length > 0 && (
          <section>
            <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">Vos prochaines sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingSessions.map(req => (
                <Card key={req.id} className="shadow-sm">
                  <CardHeader>
                    <CardTitle>{req.subject} avec {req.studentName}</CardTitle>
                    <CardDescription>Le {new Date(req.scheduledTime!).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</CardDescription>
                  </CardHeader>
                   <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">Demande: {req.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/session-feedback?session=${req.id}`}>Ajouter des notes (après session)</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}
        
        {!upcomingSessions.length && !pendingRequests.length && (
            <Card className="text-center py-12">
              <CardContent>
                <Image src="https://placehold.co/300x200.png" alt="No sessions" width={300} height={200} className="mx-auto mb-6 rounded-md" data-ai-hint="calendar empty"/>
                <h3 className="text-xl font-semibold mb-2">Aucune session ou demande pour le moment</h3>
                <p className="text-muted-foreground mb-4">Assurez-vous que vos disponibilités sont à jour pour recevoir des demandes.</p>
                <Button asChild>
                  <Link href="/dashboard/tutor/availability"><CalendarClock className="mr-2 h-4 w-4" />Gérer mes disponibilités</Link>
                </Button>
              </CardContent>
            </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
