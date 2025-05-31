"use client";

import AppLayout from '@/components/layout/AppLayout';
import SessionFeedbackForm from '@/components/tutoring/SessionFeedbackForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import type { StudentUser, TutorUser, TutoringRequest } from '@/lib/types';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data for demonstration - in a real app, this would come from URL params or state
const mockStudent: StudentUser = {
  id: 'student123',
  email: 'etudiant@ensa.dev',
  name: 'Alice Étudiante',
  role: 'student',
  program: 'Génie Informatique',
  level: '3ème année',
  difficultSubjects: ['Algorithmique avancée', 'Compilation'],
  avatarUrl: 'https://placehold.co/100x100.png',
};

const mockTutor: TutorUser = {
  id: 'tutor456',
  email: 'tuteur@ensa.dev',
  name: 'Bob Tuteur',
  role: 'tutor',
  teachableSubjects: ['Algorithmique', 'Bases de données', 'Développement Web'],
  experience: "Ancien élève ENSA, 2 ans d'expérience en tutorat.",
  availability: 'Lundi, Mercredi 18h-20h',
  bio: "Passionné par l'enseignement et l'informatique.",
  avatarUrl: 'https://placehold.co/100x100.png',
};

const mockTutoringRequest: TutoringRequest = {
  id: 'req_session1',
  studentId: 'student123',
  studentName: 'Alice Étudiante',
  subject: 'Algorithmique avancée',
  level: '3ème année',
  description: 'Difficulté avec les graphes et les arbres.',
  studentAvailability: 'Mardi soir',
  status: 'completed',
  tutorId: 'tutor456',
  tutorName: 'Bob Tuteur',
  scheduledTime: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};


export default function SessionFeedbackPage() {
  const { user, loading } = useAuth();

  // In a real app, you'd fetch the specific session details, student, and tutor
  // For now, we use the logged-in user if student, or mock if no user/tutor
  const studentForFeedback = (user?.role === 'student' ? user : mockStudent) as StudentUser;
  const tutorForFeedback = mockTutor; // This would be the tutor of the specific session
  const requestForFeedback = mockTutoringRequest; // This would be the specific request/session

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-36" />
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }
  
  // This page is typically for students to give feedback
  if (!user || user.role !== 'student') {
     return (
      <AppLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
           <Alert variant="destructive" className="max-w-lg mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Accès restreint</AlertTitle>
            <AlertDescription>
              Seuls les étudiants peuvent donner un feedback pour une session.
              { !user && (
                <Button asChild variant="link" className="p-0 h-auto ml-1">
                  <Link href="/auth/login">Se connecter en tant qu'étudiant</Link>
                </Button>
              )}
            </AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    );
  }


  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl md:text-3xl">Feedback de la session</CardTitle>
            <CardDescription>
              Partagez votre expérience pour la session de tutorat en <span className="font-semibold text-primary">{requestForFeedback.subject}</span> avec <span className="font-semibold text-primary">{tutorForFeedback.name}</span>.
              Vos retours nous aident à améliorer la plateforme.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SessionFeedbackForm 
              student={studentForFeedback} 
              tutor={tutorForFeedback} 
              tutoringRequest={requestForFeedback} 
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
