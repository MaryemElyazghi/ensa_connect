
"use client"; 

import AppLayout from '@/components/layout/AppLayout';
import TutorList from '@/components/tutoring/TutorList';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { TutorUser } from '@/lib/types';
import { Search, Filter, Loader2 } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Mock data for tutors - will be replaced by API call
// const mockTutors: TutorUser[] = [ ... ]; // Kept for reference, but not used directly

function FindTutorPageContent() {
  const searchParams = useSearchParams();
  const initialSubjectQuery = searchParams.get('subject') || '';
  // Level from query params might be used if tutors had specific levels they teach at,
  // for now, it's mostly for pre-filling if coming from a request.
  // const initialLevelQuery = searchParams.get('level') || '';


  const [allTutors, setAllTutors] = useState<TutorUser[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<TutorUser[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialSubjectQuery); // Used for direct text input search
  const [subjectFilter, setSubjectFilter] = useState(initialSubjectQuery); // Used for dropdown subject filter
  // const [levelFilter, setLevelFilter] = useState(initialLevelQuery); // Level filter (currently unused for filtering tutors themselves)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchTutors() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/tutors');
        if (!response.ok) {
          throw new Error(`Failed to fetch tutors: ${response.statusText}`);
        }
        const data: TutorUser[] = await response.json();
        setAllTutors(data);
        setFilteredTutors(data); // Initially show all tutors
      } catch (err) {
        console.error(err);
        setError((err as Error).message || 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchTutors();
  }, []);

  useEffect(() => {
    let tutorsToFilter = [...allTutors];
    
    // Combined filter: searchTerm for name/subject, subjectFilter for specific subject dropdown
    const term = searchTerm.toLowerCase();
    const specificSubject = subjectFilter.toLowerCase();

    if (term || specificSubject) {
        tutorsToFilter = tutorsToFilter.filter(tutor => {
            const nameMatch = tutor.name.toLowerCase().includes(term);
            const generalSubjectMatch = tutor.teachableSubjects.some(s => s.toLowerCase().includes(term));
            const specificSubjectDropdownMatch = specificSubject ? tutor.teachableSubjects.some(s => s.toLowerCase() === specificSubject) : true;
            
            return (nameMatch || generalSubjectMatch) && specificSubjectDropdownMatch;
        });
    }
    
    // Add level filtering if tutor data included levels they teach at.
    // For example: if (levelFilter) { tutors = tutors.filter(tutor => tutor.levels.includes(levelFilter)); }
    
    setFilteredTutors(tutorsToFilter);
  }, [searchTerm, subjectFilter, allTutors]);
  
  const handleSearch = () => {
    // The useEffect for filtering already handles this when searchTerm or subjectFilter changes.
    // This function can remain if explicit button click is desired for other actions in future.
    // For now, it primarily sets the subjectFilter if the dropdown search term is different.
    setSubjectFilter(searchTerm); // This might be redundant if using the dropdown correctly
  }

  const allSubjectsList = Array.from(new Set(allTutors.flatMap(t => t.teachableSubjects))).sort();


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
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">Matière spécifique</label>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger id="subject" className="w-full">
                    <SelectValue placeholder="Toutes les matières" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les matières</SelectItem>
                    {allSubjectsList.map(subject => (
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
        
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg text-muted-foreground">Chargement des tuteurs...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="max-w-lg mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur de chargement</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : filteredTutors.length > 0 ? (
           <TutorList tutors={filteredTutors} />
        ) : (
          <div className="text-center py-10">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Aucun tuteur trouvé</h3>
            <p className="text-muted-foreground">Essayez d'ajuster vos filtres de recherche ou explorez tous nos tuteurs.</p>
            { (searchTerm || subjectFilter) && 
                <Button variant="outline" className="mt-4" onClick={() => {setSearchTerm(''); setSubjectFilter('');}}>
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
    // Suspense boundary for Next.js navigation related data fetching (useSearchParams)
    <Suspense fallback={
        <AppLayout>
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-4 text-lg text-muted-foreground">Chargement...</p>
            </div>
        </AppLayout>
    }>
      <FindTutorPageContent />
    </Suspense>
  )
}
