"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import TutoringRequestForm from '@/components/tutoring/TutoringRequestForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import type { StudentUser } from '@/lib/types';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function NewTutoringRequestPage() {
  const { user } = useAuth();

  if (!user || user.role !== 'student') {
    return (
      <DashboardLayout>
         <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Accès non autorisé</AlertTitle>
          <AlertDescription>Vous devez être connecté en tant qu'étudiant pour faire une demande de tutorat.</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl md:text-3xl">Nouvelle demande de tutorat</CardTitle>
          <CardDescription>Remplissez le formulaire ci-dessous pour trouver un tuteur adapté à vos besoins.</CardDescription>
        </CardHeader>
        <CardContent>
          <TutoringRequestForm student={user as StudentUser} />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
