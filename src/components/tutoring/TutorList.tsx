import type { TutorUser } from '@/lib/types';
import TutorCard from './TutorCard';

interface TutorListProps {
  tutors: TutorUser[];
}

export default function TutorList({ tutors }: TutorListProps) {
  if (tutors.length === 0) {
    return <p className="text-center text-muted-foreground">Aucun tuteur ne correspond à vos critères pour le moment.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tutors.map((tutor) => (
        <TutorCard key={tutor.id} tutor={tutor} />
      ))}
    </div>
  );
}
