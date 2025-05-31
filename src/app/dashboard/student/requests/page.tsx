
"use client";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { TutoringRequest } from '@/lib/types';
import { AlertTriangle, CheckCircle2, Clock, Hourglass, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const statusMap: Record<TutoringRequest['status'], { label: string; icon: React.ElementType; color: string; badgeVariant: "default" | "secondary" | "destructive" | "outline" | null | undefined }> = {
  pending: { label: "En attente", icon: Hourglass, color: "text-yellow-500", badgeVariant: "secondary" },
  matched: { label: "Confirmée", icon: CheckCircle2, color: "text-green-500", badgeVariant: "default" },
  active: { label: "En cours", icon: Clock, color: "text-blue-500", badgeVariant: "default" }, // Assuming active means scheduled/upcoming for student
  completed: { label: "Terminée", icon: CheckCircle2, color: "text-green-700", badgeVariant: "default" },
  cancelled: { label: "Annulée", icon: AlertTriangle, color: "text-red-500", badgeVariant: "destructive" },
};


export default function StudentRequestsPage() {
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
    } else {
      setIsLoading(false); // Not a student or no user, stop loading
    }
  }, [user]);

  // TODO: Implement cancel request functionality
  // async function cancelRequest(requestId: string) {
  //   // Call API to update request status to 'cancelled'
  //   // Update local state or re-fetch
  // }


  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" /> 
          <p className="ml-2">Chargement de vos demandes...</p>
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
  
  if (!user || user.role !== 'student') {
    // This check might be redundant if DashboardLayout handles unauthorized access,
    // but it's good for robustness.
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
                      <Badge variant={statusInfo.badgeVariant} className={`capitalize ${statusInfo.color}`}>
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
                    {(req.status === 'matched' || req.status === 'active') && req.tutorName && (
                      <Button variant="outline" size="sm" asChild>
                        {/* Chat link functionality to be implemented */}
                        <Link href={`#`}> 
                          <MessageSquare className="h-4 w-4 mr-1.5" /> Contacter {req.tutorName.split(' ')[0]}
                        </Link>
                      </Button>
                    )}
                    {req.status === 'pending' && (
                      <Button variant="destructive" size="sm" /*onClick={() => cancelRequest(req.id)}*/>Annuler la demande</Button>
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
