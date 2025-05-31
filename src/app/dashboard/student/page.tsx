
"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import type { TutoringRequest } from '@/lib/types';
import { AlertCircle, PlusCircle, ListChecks, History, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useEffect, useState } from 'react';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<TutoringRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role === 'student') {
      const fetchRequests = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/tutoring-requests?studentId=${user.id}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch tutoring requests');
          }
          const data: TutoringRequest[] = await response.json();
          setRequests(data);
        } catch (err) {
          console.error(err);
          setError((err as Error).message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchRequests();
    } else if (user && user.role !== 'student') {
        setIsLoading(false); // Not a student, no requests to load for this dashboard
    } else {
        setIsLoading(false); // No user logged in
    }
  }, [user]);

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
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" /> 
          <p className="ml-2">Chargement de vos données...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  const upcomingSessions = requests.filter(r => r.status === 'matched' || r.status === 'active');
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const completedSessions = requests.filter(r => r.status === 'completed');

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
                    <CardDescription>Avec {req.tutorName} - Le {req.scheduledTime ? new Date(req.scheduledTime).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Date à confirmer'}</CardDescription>
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

        {completedSessions.length > 0 && (
           <section>
            <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">Historique des sessions</h2>
             <div className="space-y-4">
                {completedSessions.map(req => (
                    <Card key={req.id} className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">{req.subject}</CardTitle>
                            <CardDescription>Session avec {req.tutorName} - Terminée le {req.scheduledTime ? new Date(req.scheduledTime).toLocaleDateString('fr-FR') : 'Date inconnue'}</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-between items-center">
                            <Link href={`/session-feedback?session=${req.id}&view=true`} className="text-sm text-primary hover:underline">
                                Voir le feedback (si disponible)
                            </Link>
                            {/* Placeholder for actual feedback rating if fetched */}
                        </CardFooter>
                    </Card>
                ))}
             </div>
          </section>
        )}


        {!isLoading && requests.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Image src="https://placehold.co/300x200.png" alt="No requests" width={300} height={200} className="mx-auto mb-6 rounded-md" data-ai-hint="empty state illustration"/>
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
