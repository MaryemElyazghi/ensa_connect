"use client";

import AppLayout from '@/components/layout/AppLayout';
import StudentProfileForm from '@/components/profile/StudentProfileForm';
import TutorProfileForm from '@/components/profile/TutorProfileForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import type { StudentUser, TutorUser } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Button } from '@/components/ui/button';


export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-36" />
            </CardContent>
          </Card>
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
            <AlertTitle>Accès non autorisé</AlertTitle>
            <AlertDescription>
              Vous devez être connecté pour accéder à cette page.
              <Button asChild variant="link" className="p-0 h-auto ml-1">
                <Link href="/auth/login">Se connecter</Link>
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl md:text-3xl">Mon Profil</CardTitle>
            <CardDescription>Gérez vos informations personnelles et professionnelles.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-8">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait" />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-sm text-primary capitalize">{user.role === 'student' ? 'Étudiant(e)' : 'Tuteur/Tutrice'}</p>
              </div>
            </div>

            {user.role === 'student' && <StudentProfileForm student={user as StudentUser} />}
            {user.role === 'tutor' && <TutorProfileForm tutor={user as TutorUser} />}
            {user.role !== 'student' && user.role !== 'tutor' && (
                <p>Type de profil non supporté pour l'édition.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
