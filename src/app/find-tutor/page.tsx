"use client"; // This page will involve client-side filtering or fetching based on search params

import AppLayout from '@/components/layout/AppLayout';
import TutorList from '@/components/tutoring/TutorList';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { TutorUser } from '@/lib/types';
import { Search, Filter } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for tutors
const mockTutors: TutorUser[] = [
  {
    id: 'tutor1',
    name: 'Dr. Elara Vance',
    email: 'elara.vance@example.com',
    role: 'tutor',
    teachableSubjects: ['Mathématiques Avancées', 'Physique Quantique', 'Algorithmique'],
    experience: 'Professeur universitaire avec 10 ans d\'expérience en tutorat.',
    availability: 'Mardis et Jeudis soirs',
    avatarUrl: 'https://placehold.co/150x150.png',
    bio: 'Passionnée par la transmission du savoir, j\'aide les étudiants à surmonter les défis complexes.',
  },
  {
    id: 'tutor2',
    name: 'Marcus Chen',
    email: 'marcus.chen@example.com',
    role: 'tutor',
    teachableSubjects: ['Développement Web', 'Bases de Données', 'Python'],
    experience: 'Développeur Full-Stack Senior, ancien élève ENSA.',
    availability: 'Weekends, Lundis après-midi',
    avatarUrl: 'https://placehold.co/150x150.png',
    bio: 'Je transforme les concepts de code ardus en projets concrets et compréhensibles.',
  },
  {
    id: 'tutor3',
    name: 'Sofia Benali',
    email: 'sofia.benali@example.com',
    role: 'tutor',
    teachableSubjects: ['Chimie Organique', 'Biologie Moléculaire'],
    experience: 'Doctorante en chimie, 3 ans de tutorat niveau universitaire.',
    availability: 'Mercredis et Vendredis toute la journée',
    avatarUrl: 'https://placehold.co/150x150.png',
    bio: 'Ma méthode : rendre la science accessible et stimulante.',
  },
   {
    id: 'tutor4',
    name: 'Ahmed Al Fassi',
    email: 'ahmed.alfassi@example.com',
    role: 'tutor',
    teachableSubjects: ['Algorithmique', 'Structures de Données', 'Java'],
    experience: 'Ingénieur logiciel chez TechCorp, 5 ans d\'expérience.',
    availability: 'Soirées en semaine',
    avatarUrl: 'https://placehold.co/150x150.png',
    bio: 'Je me concentre sur la résolution de problèmes et la logique algorithmique.',
  },
];

function FindTutorPageContent() {
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get('subject') || '';
  const initialLevel = searchParams.get('level') || '';

  const [searchTerm, setSearchTerm] = useState(initialSubject);
  const [subjectFilter, setSubjectFilter] = useState(initialSubject);
  const [levelFilter, setLevelFilter] = useState(initialLevel);
  const [filteredTutors, setFilteredTutors] = useState<TutorUser[]>(mockTutors);

  useEffect(() => {
    let tutors = mockTutors;
    if (subjectFilter) {
      tutors = tutors.filter(tutor =>
        tutor.teachableSubjects.some(s => s.toLowerCase().includes(subjectFilter.toLowerCase())) ||
        tutor.name.toLowerCase().includes(subjectFilter.toLowerCase())
      );
    }
    // Add level filtering if needed - current mock data doesn't have tutor levels
    // if (levelFilter) { ... }
    setFilteredTutors(tutors);
  }, [subjectFilter, levelFilter]);
  
  const handleSearch = () => {
    setSubjectFilter(searchTerm);
  }

  const allSubjects = Array.from(new Set(mockTutors.flatMap(t => t.teachableSubjects))).sort();


  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-12 text-center">
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-foreground mb-4">Trouver un Tuteur</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recherchez parmi nos tuteurs qualifiés pour trouver celui qui correspond le mieux à vos besoins académiques.
          </p>
        </section>

        <Card className="mb-8 shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center">
              <Filter className="h-5 w-5 mr-2 text-primary" />
              Filtrer les tuteurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-foreground mb-1">Rechercher par nom ou matière</label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Ex: Mathématiques, Dr. Vance..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              {/* 
              // Removed level filter as it's less relevant for initial tutor search without defined tutor levels
              // One might filter by subjects typically taught at a certain level if data supported it.
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-foreground mb-1">Niveau</label>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger id="level" className="w-full">
                    <SelectValue placeholder="Tous les niveaux" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les niveaux</SelectItem>
                    <SelectItem value="Débutant">Débutant</SelectItem>
                    <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                    <SelectItem value="Avancé">Avancé</SelectItem>
                    <SelectItem value="1ère année">1ère année</SelectItem>
                     <SelectItem value="2ème année">2ème année</SelectItem>
                    <SelectItem value="3ème année">3ème année</SelectItem>
                    <SelectItem value="Master">Master</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              */}
               <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">Matière spécifique</label>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger id="subject" className="w-full">
                    <SelectValue placeholder="Toutes les matières" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les matières</SelectItem>
                    {allSubjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSearch} className="md:col-start-3">
                <Search className="mr-2 h-4 w-4" /> Rechercher
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {filteredTutors.length > 0 ? (
           <TutorList tutors={filteredTutors} />
        ) : (
          <div className="text-center py-10">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Aucun tuteur trouvé</h3>
            <p className="text-muted-foreground">Essayez d'ajuster vos filtres de recherche ou explorez tous nos tuteurs.</p>
            { (subjectFilter || levelFilter) && 
                <Button variant="outline" className="mt-4" onClick={() => {setSearchTerm(''); setSubjectFilter(''); setLevelFilter('');}}>
                    Réinitialiser les filtres
                </Button>
            }
          </div>
        )}
      </div>
    </AppLayout>
  );
}


export default function FindTutorPage() {
  return (
    <Suspense fallback={<div>Chargement des tuteurs...</div>}>
      <FindTutorPageContent />
    </Suspense>
  )
}

