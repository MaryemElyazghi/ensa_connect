import type { SuggestLearningMaterialsOutput } from "@/ai/flows/learning-material-suggestion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, BookUser, GraduationCap } from "lucide-react";

interface AISuggestionsDisplayProps {
  suggestions: SuggestLearningMaterialsOutput;
}

export default function AISuggestionsDisplay({ suggestions }: AISuggestionsDisplayProps) {
  const hasStudentMaterials = suggestions.studentMaterials && suggestions.studentMaterials.length > 0;
  const hasTutorMaterials = suggestions.tutorMaterials && suggestions.tutorMaterials.length > 0;

  if (!hasStudentMaterials && !hasTutorMaterials && !suggestions.explanation) {
    return null; // Or a message saying no specific suggestions were generated
  }

  return (
    <Card className="bg-accent/50 border-accent shadow-lg">
      <CardHeader>
        <div className="flex items-center">
          <Lightbulb className="h-8 w-8 text-primary mr-3" />
          <CardTitle className="font-headline text-2xl">Suggestions d'apprentissage IA</CardTitle>
        </div>
        {suggestions.explanation && (
          <CardDescription className="pt-2 text-sm">{suggestions.explanation}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {hasStudentMaterials && (
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center text-foreground">
              <GraduationCap className="h-5 w-5 mr-2 text-primary" />
              Pour l'étudiant :
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
              {suggestions.studentMaterials.map((material, index) => (
                <li key={`student-${index}`}>{material}</li>
              ))}
            </ul>
          </div>
        )}

        {hasTutorMaterials && (
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center text-foreground">
              <BookUser className="h-5 w-5 mr-2 text-primary" />
              Pour le tuteur :
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
              {suggestions.tutorMaterials.map((material, index) => (
                <li key={`tutor-${index}`}>{material}</li>
              ))}
            </ul>
          </div>
        )}

        {!hasStudentMaterials && !hasTutorMaterials && suggestions.explanation && (
             <p className="text-sm text-muted-foreground">L'IA a fourni une explication mais pas de listes de matériel spécifiques pour cette session.</p>
        )}
      </CardContent>
    </Card>
  );
}
