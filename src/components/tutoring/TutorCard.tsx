import type { TutorUser } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Star, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface TutorCardProps {
  tutor: TutorUser;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Mock rating
  const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src={tutor.avatarUrl} alt={tutor.name} data-ai-hint="person teaching" />
          <AvatarFallback>{getInitials(tutor.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="font-headline text-xl mb-1">{tutor.name}</CardTitle>
          <div className="flex items-center text-sm text-yellow-500 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-current' : ''}`} />
            ))}
            <span className="ml-1 text-muted-foreground">({rating}.0)</span>
          </div>
          <CardDescription className="text-xs line-clamp-2">{tutor.experience}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-3">
          <h4 className="text-sm font-semibold mb-1 text-foreground flex items-center">
            <BookOpen className="h-4 w-4 mr-2 text-primary" />
            Matières enseignées:
          </h4>
          <div className="flex flex-wrap gap-1">
            {tutor.teachableSubjects.slice(0, 3).map((subject) => (
              <Badge key={subject} variant="secondary">{subject}</Badge>
            ))}
            {tutor.teachableSubjects.length > 3 && <Badge variant="secondary">+{tutor.teachableSubjects.length - 3}</Badge>}
          </div>
        </div>
        {tutor.bio && (
          <div className="mb-3">
            <h4 className="text-sm font-semibold mb-1 text-foreground">Bio:</h4>
            <p className="text-xs text-muted-foreground line-clamp-3">{tutor.bio}</p>
          </div>
        )}
        <div>
          <h4 className="text-sm font-semibold mb-1 text-foreground">Disponibilités:</h4>
          <p className="text-xs text-muted-foreground">{tutor.availability}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4">
        <Button size="sm" className="w-full sm:w-auto flex-1" asChild>
          <Link href={`/profile/${tutor.id}`}>Voir le profil</Link>
        </Button>
        <Button size="sm" variant="outline" className="w-full sm:w-auto flex-1" asChild>
          {/* This would ideally open a chat or pre-fill an email */}
          <Link href={`mailto:${tutor.email}`}>
            <MessageSquare className="h-4 w-4 mr-2" /> Contacter
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
