
"use client";

import AppLayout from '@/components/layout/AppLayout';
import SessionFeedbackForm from '@/components/tutoring/SessionFeedbackForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import type { StudentUser, TutorUser, TutoringRequest } from '@/lib/types';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function SessionFeedbackPageContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const requestId = searchParams.get('session'); // Changed from 'requestId' to 'session' to match dashboard links
  // const viewingRole = searchParams.get('role'); // 'tutor' or 'student' - for viewing existing feedback

  const [tutoringRequest, setTutoringRequest] = useState<TutoringRequest | null>(null);
  const [studentForFeedback, setStudentForFeedback] = useState<StudentUser | null>(null);
  const [tutorForFeedback, setTutorForFeedback] = useState<TutorUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    if (!requestId || authLoading) {
      if(!requestId && !authLoading) setIsLoading(false); // if no requestId and not authLoading, stop loading
      return;
    }

    async function fetchSessionDetails() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/tutoring-requests/${requestId}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `Failed to fetch session details: ${res.statusText}`);
        }
        const requestData: TutoringRequest = await res.json();
        setTutoringRequest(requestData);

        // Fetch student and tutor details if IDs are present
        // For simplicity, we assume student and tutor objects might be populated or names are on requestData
        // In a real app, you'd fetch User by ID if only IDs are present
        if (requestData.studentId && user?.role === 'student') {
             setStudentForFeedback(user as StudentUser); // The logged in user is the student
        } else if (requestData.studentId) {
            // Fetch student if current user is not the student (e.g. admin view)
            // const studentRes = await fetch(`/api/profile/${requestData.studentId}`);
            // if (studentRes.ok) setStudentForFeedback(await studentRes.json());
            // For now, assume student logged in is the one giving feedback
        }


        if (requestData.tutorId) {
            // Fetch tutor (can be simplified if full tutor object is populated by API)
            // For now, create a mock tutor object if only name is available
            setTutorForFeedback({ 
                id: requestData.tutorId, 
                name: requestData.tutorName || "Tuteur", 
                email: 'tutor@example.com', // Placeholder
                role: 'tutor',
                teachableSubjects: [], experience: '', availability: '', // Placeholders
            } as TutorUser);

            // Example of fetching full tutor (if API /api/profile/[userId] exists and is robust)
            // const tutorRes = await fetch(`/api/profile/${requestData.tutorId}`);
            // if (tutorRes.ok) {
            //     setTutorForFeedback(await tutorRes.json());
            // } else {
            //     console.warn("Could not fetch full tutor details for feedback form");
            // }
        }

      } catch (err) {
        console.error(err);
        setError((err as Error).message || 'An unknown error occurred while fetching session details.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSessionDetails();
  }, [requestId, user, authLoading]);

  if (authLoading || isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <Alert variant="destructive" className="max-w-lg mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    );
  }
  
  if (!user) {
     return (
      <AppLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
           <Alert variant="destructive" className="max-w-lg mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Accès restreint</AlertTitle>
            <AlertDescription>
              Vous devez être connecté pour donner un feedback.
                <Button asChild variant="link" className="p-0 h-auto ml-1">
                  <Link href="/auth/login">Se connecter</Link>
                </Button>
            </AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    );
  }

  if (user.role !== 'student') {
      // Currently, only students give feedback. Tutors might view or add notes differently.
       return (
        <AppLayout>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
             <Alert variant="destructive" className="max-w-lg mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Accès restreint</AlertTitle>
              <AlertDescription>
                Seuls les étudiants peuvent donner un feedback pour une session via ce formulaire.
              </AlertDescription>
            </Alert>
          </div>
        </AppLayout>
      );
  }

  if (!tutoringRequest || !studentForFeedback || !tutorForFeedback) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <Alert className="max-w-lg mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Information manquante</AlertTitle>
            <AlertDescription>
              Impossible de charger les détails de la session. Vérifiez que l'ID de session est correct ou réessayez.
              Si le problème persiste, contactez le support.
            </AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    );
  }

  if (feedbackSubmitted) {
    return (
         <AppLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <Card className="max-w-2xl mx-auto shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl md:text-3xl">Merci pour votre feedback !</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">Votre retour a bien été enregistré.</p>
                        <Button asChild>
                            <Link href="/dashboard/student">Retour au tableau de bord</Link>
                        </Button>
                    </CardContent>
                </Card>
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
              Partagez votre expérience pour la session de tutorat en <span className="font-semibold text-primary">{tutoringRequest.subject}</span> avec <span className="font-semibold text-primary">{tutorForFeedback.name}</span>.
              Vos retours nous aident à améliorer la plateforme.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SessionFeedbackForm 
              student={studentForFeedback} 
              tutor={tutorForFeedback} 
              tutoringRequest={tutoringRequest}
              onFeedbackSubmitted={() => setFeedbackSubmitted(true)}
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

export default function SessionFeedbackPage() {
  return (
    <Suspense fallback={
      <AppLayout>
        <div className="flex justify-center items-center min-h-[70vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </AppLayout>
    }>
      <SessionFeedbackPageContent />
    </Suspense>
  )
}
