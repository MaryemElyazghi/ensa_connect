"use client";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { TutoringRequest } from '@/lib/types';
import { AlertTriangle, CheckCircle2, Clock, Hourglass, MessageSquare } from 'lucide-react';
import Link from 'next/link';

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
  {
    id: 'req4', studentId: 'student123', studentName: 'Alice Étudiante', subject: 'Réseaux', level: 'Master 1',
    description: 'Configuration de VLANs.', studentAvailability: 'Vendredi matin', status: 'cancelled',
    createdAt: '2024-07-10T09:00:00Z'
  },
];

const statusMap: Record<TutoringRequest['status'], { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: "En attente", icon: Hourglass, color: "text-yellow-500" },
  matched: { label: "Confirmée", icon: CheckCircle2, color: "text-green-500" },
  active: { label: "En cours", icon: Clock, color: "text-blue-500" },
  completed: { label: "Terminée", icon: CheckCircle2, color: "text-green-700" },
  cancelled: { label: "Annulée", icon: AlertTriangle, color: "text-red-500" },
};


export default function StudentRequestsPage() {
  // In a real app, fetch requests for the logged-in student
  const requests = mockRequests;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-headline text-3xl font-bold text-foreground">Mes Demandes de Tutorat</h1>
        
        {requests.length === 0 ? (
          <p className="text-muted-foreground">Vous n'avez pas encore fait de demande de tutorat.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map(req => {
              const statusInfo = statusMap[req.status];
              const StatusIcon = statusInfo.icon;
              return (
                <Card key={req.id} className="shadow-md">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{req.subject}</CardTitle>
                      <Badge variant={
                        req.status === 'completed' || req.status === 'matched' ? 'default' :
                        req.status === 'pending' ? 'secondary' : 'destructive'
                      } className={`capitalize ${statusInfo.color}`}>
                        <StatusIcon className="h-4 w-4 mr-1.5" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <CardDescription>Demandé le: {new Date(req.createdAt).toLocaleDateString('fr-FR')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><span className="font-medium">Niveau:</span> {req.level}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2"><span className="font-medium text-foreground">Description:</span> {req.description}</p>
                    {req.tutorName && <p><span className="font-medium">Tuteur:</span> {req.tutorName}</p>}
                    {req.scheduledTime && <p><span className="font-medium">Session planifiée:</span> {new Date(req.scheduledTime).toLocaleString('fr-FR')}</p>}
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    {(req.status === 'matched' || req.status === 'active') && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/chat/${req.id}`}> {/* Mock chat link */}
                          <MessageSquare className="h-4 w-4 mr-1.5" /> Contacter {req.tutorName}
                        </Link>
                      </Button>
                    )}
                    {req.status === 'pending' && (
                      <Button variant="destructive" size="sm">Annuler la demande</Button>
                    )}
                     {req.status === 'completed' && (
                      <Button variant="default" size="sm" asChild>
                        <Link href={`/session-feedback?session=${req.id}`}>Noter la session</Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
        <div className="mt-8">
            <Button asChild>
                <Link href="/dashboard/student/new-request">Faire une nouvelle demande</Link>
            </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
