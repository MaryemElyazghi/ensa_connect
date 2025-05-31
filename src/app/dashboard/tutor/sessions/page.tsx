
"use client";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { TutoringRequest, TutorUser } from '@/lib/types';
import { AlertTriangle, CheckCircle2, Clock, Hourglass, CalendarDays, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';


const statusMap: Record<TutoringRequest['status'], { label: string; icon: React.ElementType; color: string; badgeVariant: "default" | "secondary" | "destructive" | "outline" | null | undefined }> = {
  pending: { label: "Nouvelle demande", icon: Hourglass, color: "text-yellow-500", badgeVariant: "secondary" },
  matched: { label: "Acceptée / À venir", icon: CheckCircle2, color: "text-blue-500", badgeVariant: "default" }, 
  active: { label: "En cours", icon: Clock, color: "text-blue-500", badgeVariant: "default" },
  completed: { label: "Terminée", icon: CheckCircle2, color: "text-green-700", badgeVariant: "default" },
  cancelled: { label: "Annulée", icon: AlertTriangle, color: "text-red-500", badgeVariant: "destructive" },
};

export default function TutorSessionsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<TutoringRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentTutor = user as TutorUser | null;

  const fetchSessions = async () => {
    if (!currentTutor) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tutoring-requests?tutorId=${currentTutor.id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch sessions');
      }
      const data: TutoringRequest[] = await response.json();
      // Filter out 'pending' requests that are not yet accepted by *this* tutor,
      // unless the API already guarantees only assigned requests.
      // For now, we assume API returns requests where this tutor is `tutorId`.
      setSessions(data.filter(s => s.status !== 'pending' || s.tutorId === currentTutor.id));
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'tutor') {
      fetchSessions();
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
          status: 'matched',
          // scheduledTime: ... // Consider adding a scheduling step or modal
        }),
      });
      if (!response.ok) throw new Error('Failed to accept request');
      toast({ title: "Demande acceptée!", description: "La session est planifiée." });
      fetchSessions(); // Refresh data
    } catch (error) {
       toast({ title: "Erreur", description: (error as Error).message, variant: "destructive" });
    }
  };
  
  const handleMarkAsCompleted = async (requestId: string) => {
    try {
      const response = await fetch(`/api/tutoring-requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
      if (!response.ok) throw new Error('Failed to mark as completed');
      toast({ title: "Session terminée!", description: "La session a été marquée comme terminée." });
      fetchSessions(); // Refresh data
    } catch (error) {
       toast({ title: "Erreur", description: (error as Error).message, variant: "destructive" });
    }
  };


  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Chargement de vos sessions...</p>
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


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="font-headline text-3xl font-bold text-foreground">Mes Sessions de Tutorat</h1>
            <Button asChild>
                <Link href="/dashboard/tutor/availability"><CalendarDays className="mr-2 h-4 w-4" /> Gérer mes disponibilités</Link>
            </Button>
        </div>
        
        {sessions.length === 0 ? (
          <Card className="text-center py-10">
            <CardContent>
              <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground">Aucune session pour le moment</h3>
              <p className="text-muted-foreground">Les demandes que vous acceptez apparaîtront ici.</p>
               <Button asChild className="mt-4">
                <Link href="/dashboard/tutor">Voir les nouvelles demandes</Link>
            </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sessions.map(session => {
              const statusInfo = statusMap[session.status];
              const StatusIcon = statusInfo.icon;
              return (
                <Card key={session.id} className="shadow-md">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{session.subject} avec {session.studentName}</CardTitle>
                       <Badge variant={statusInfo.badgeVariant} className={`capitalize ${statusInfo.color}`}>
                        <StatusIcon className="h-4 w-4 mr-1.5" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <CardDescription>
                        {session.scheduledTime ? `Planifiée le: ${new Date(session.scheduledTime).toLocaleString('fr-FR')}` : `Demandée le: ${new Date(session.createdAt).toLocaleDateString('fr-FR')}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><span className="font-medium">Étudiant:</span> {session.studentName} ({session.level})</p>
                    <p className="text-sm text-muted-foreground line-clamp-2"><span className="font-medium text-foreground">Besoin:</span> {session.description}</p>
                    <p><span className="font-medium">Disponibilités de l'étudiant:</span> {session.studentAvailability}</p>
                  </CardContent>
                  <CardFooter className="flex flex-wrap justify-end gap-2">
                    {session.status === 'pending' && session.tutorId !== currentTutor?.id && ( // A general pending request matching tutor's subjects
                        <Button size="sm" onClick={() => handleAcceptRequest(session.id)}>Accepter</Button>
                    )}
                     {session.status === 'pending' && session.tutorId === currentTutor?.id && ( // Directly assigned but not yet actioned
                        <Button size="sm" onClick={() => handleAcceptRequest(session.id)}>Confirmer et Planifier</Button>
                    )}
                    {(session.status === 'matched' || session.status === 'active') && (
                      <>
                        <Button variant="outline" size="sm">Contacter {session.studentName}</Button>
                        <Button variant="secondary" size="sm" onClick={() => handleMarkAsCompleted(session.id)}>Marquer comme terminée</Button>
                      </>
                    )}
                     {session.status === 'completed' && (
                      <Button variant="default" size="sm" asChild>
                        <Link href={`/session-feedback?session=${session.id}&role=tutor`}>Ajouter/Voir notes</Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
