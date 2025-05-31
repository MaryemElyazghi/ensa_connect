"use client";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { TutoringRequest } from '@/lib/types';
import { AlertTriangle, CheckCircle2, Clock, Hourglass, Users, CalendarDays } from 'lucide-react';
import Link from 'next/link';

const mockTutorSessions: TutoringRequest[] = [
  {
    id: 'req1', studentId: 'student123', studentName: 'Alice Étudiante', subject: 'Algorithmique', level: '3ème année',
    description: 'Besoin d\'aide sur les graphes.', studentAvailability: 'Lundi soir', status: 'active', 
    tutorId: 'tutor456', tutorName: 'Bob Tuteur', scheduledTime: '2024-07-29T18:00:00Z', createdAt: '2024-07-25T10:00:00Z'
  },
  {
    id: 'req4', studentId: 'student789', studentName: 'Charlie Apprenant', subject: 'Développement Web', level: '2ème année',
    description: 'Problèmes avec Flexbox en CSS.', studentAvailability: 'Jeudi matin', status: 'pending', 
    tutorId: 'tutor456', tutorName: 'Bob Tuteur', createdAt: '2024-07-27T11:00:00Z'
  },
   {
    id: 'req5', studentId: 'studentABC', studentName: 'Diana Codeuse', subject: 'Bases de Données', level: 'Master 1',
    description: 'Optimisation de requêtes SQL.', studentAvailability: 'Vendredi après-midi', status: 'completed',
    tutorId: 'tutor456', tutorName: 'Bob Tuteur', scheduledTime: '2024-07-19T15:00:00Z', createdAt: '2024-07-12T10:00:00Z'
  },
  {
    id: 'req6', studentId: 'studentXYZ', studentName: 'Émile Programmeur', subject: 'Algorithmique', level: '3ème année',
    description: 'Préparation examen arbres binaires.', studentAvailability: 'Samedi matin', status: 'active', 
    tutorId: 'tutor456', tutorName: 'Bob Tuteur', scheduledTime: '2024-08-03T10:00:00Z', createdAt: '2024-07-28T15:00:00Z'
  },
];

const statusMap: Record<TutoringRequest['status'], { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: "Nouvelle demande", icon: Hourglass, color: "text-yellow-500" },
  matched: { label: "Acceptée", icon: CheckCircle2, color: "text-blue-500" }, // Tutor context: matched = accepted
  active: { label: "À venir / En cours", icon: Clock, color: "text-blue-500" },
  completed: { label: "Terminée", icon: CheckCircle2, color: "text-green-700" },
  cancelled: { label: "Annulée", icon: AlertTriangle, color: "text-red-500" },
};

export default function TutorSessionsPage() {
  // In a real app, fetch sessions for the logged-in tutor
  const sessions = mockTutorSessions;

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
          <p className="text-muted-foreground">Vous n'avez pas encore de session de tutorat.</p>
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
                       <Badge variant={
                        session.status === 'completed' || session.status === 'active' ? 'default' :
                        session.status === 'pending' ? 'secondary' : 'destructive'
                      } className={`capitalize ${statusInfo.color}`}>
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
                  <CardFooter className="flex justify-end gap-2">
                    {session.status === 'pending' && (
                        <>
                        <Button size="sm">Accepter</Button>
                        <Button variant="outline" size="sm">Refuser</Button>
                        </>
                    )}
                    {(session.status === 'active' || session.status === 'matched') && (
                      <Button variant="outline" size="sm">Contacter {session.studentName}</Button>
                    )}
                     {session.status === 'completed' && (
                      <Button variant="default" size="sm" asChild>
                        <Link href={`/session-feedback?session=${session.id}&role=tutor`}>Ajouter des notes</Link>
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
