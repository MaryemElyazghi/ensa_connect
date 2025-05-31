
"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import type { TutoringRequest, TutorUser } from '@/lib/types';
import { AlertCircle, CalendarClock, ListChecks, UserCheck, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export default function TutorDashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pendingRequests, setPendingRequests] = useState<TutoringRequest[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<TutoringRequest[]>([]);
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentTutor = user as TutorUser | null;

  const fetchTutorData = async () => {
    if (!currentTutor) return;
    setIsLoading(true);
    setError(null);
    try {
      // Fetch pending requests (could be all, or filtered by tutor's subjects server-side)
      const pendingRes = await fetch(`/api/tutoring-requests?status=pending`);
      if (!pendingRes.ok) throw new Error('Failed to fetch pending requests');
      let allPending: TutoringRequest[] = await pendingRes.json();
      // Client-side filter for demo: tutor sees requests matching their subjects
      allPending = allPending.filter(req => 
        currentTutor.teachableSubjects.some(subj => subj.toLowerCase() === req.subject.toLowerCase())
      );
      setPendingRequests(allPending);

      // Fetch sessions matched with this tutor (upcoming/active)
      const upcomingRes = await fetch(`/api/tutoring-requests?tutorId=${currentTutor.id}&status=matched`); // or 'active'
      if (!upcomingRes.ok) throw new Error('Failed to fetch upcoming sessions');
      setUpcomingSessions(await upcomingRes.json());
      
      // Fetch completed sessions for this tutor to count students helped
      const completedRes = await fetch(`/api/tutoring-requests?tutorId=${currentTutor.id}&status=completed`);
      if (!completedRes.ok) throw new Error('Failed to fetch completed sessions');
      const completedData: TutoringRequest[] = await completedRes.json();
      setCompletedSessionsCount(new Set(completedData.map(s => s.studentId)).size);

    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'tutor') {
      fetchTutorData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleAcceptRequest = async (requestId: string) => {
    if (!currentTutor) return;
    try {
      const response = await fetch(`/api/tutoring-requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tutorId: currentTutor.id, 
          tutorName: currentTutor.name, 
          status: 'matched', // Or prompt for scheduling then 'matched'
          // scheduledTime: new Date().toISOString() // Placeholder, ideally a scheduling step
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to accept request');
      }
      toast({ title: "Demande acceptée!", description: "La session est maintenant planifiée." });
      fetchTutorData(); // Refresh data
    } catch (error) {
      toast({ title: "Erreur", description: (error as Error).message, variant: "destructive" });
    }
  };


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
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
           <p className="ml-2">Chargement du tableau de bord...</p>
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
              <CardTitle className="text-sm font-medium">Demandes pertinentes</CardTitle>
              <ListChecks className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests.length}</div>
              <p className="text-xs text-muted-foreground">
                {pendingRequests.length > 0 ? "Nouvelles demandes à examiner" : "Aucune nouvelle demande pertinente"}
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
              <div className="text-2xl font-bold">{completedSessionsCount}</div>
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
                    <Button size="sm" onClick={() => handleAcceptRequest(req.id)}><UserCheck className="mr-2 h-4 w-4"/> Accepter</Button>
                    {/* <Button size="sm" variant="outline">Refuser</Button> */}
                    {/* <Button size="sm" variant="ghost">Plus de détails</Button> */}
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
                    <CardDescription>{req.scheduledTime ? `Le ${new Date(req.scheduledTime).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}` : "Date à définir"}</CardDescription>
                  </CardHeader>
                   <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">Demande: {req.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/session-feedback?session=${req.id}&role=tutor`}>Ajouter des notes (après session)</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}
        
        {!isLoading && upcomingSessions.length === 0 && pendingRequests.length === 0 && (
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
