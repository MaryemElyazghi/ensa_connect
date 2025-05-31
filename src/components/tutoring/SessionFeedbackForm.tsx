"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import type { StudentUser, TutorUser, SessionFeedback, TutoringRequest } from "@/lib/types";
import { Star, Send } from "lucide-react";
import { useState } from "react";
import type { SuggestLearningMaterialsInput, SuggestLearningMaterialsOutput } from "@/ai/flows/learning-material-suggestion";
import { suggestLearningMaterials as suggestLearningMaterialsFlow } from "@/ai/flows/learning-material-suggestion";
import AISuggestionsDisplay from "./AISuggestionsDisplay"; // To be created

const sessionFeedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  comments: z.string().min(10, { message: "Veuillez fournir un commentaire d'au moins 10 caractères." }),
  topicsCovered: z.string().min(5, { message: "Veuillez lister les sujets abordés (min. 5 caractères)." }),
});

type SessionFeedbackFormValues = z.infer<typeof sessionFeedbackSchema>;

interface SessionFeedbackFormProps {
  // These would typically be fetched based on a session ID
  student: StudentUser; 
  tutor: TutorUser;
  tutoringRequest: TutoringRequest; // To get module/subject
}

export default function SessionFeedbackForm({ student, tutor, tutoringRequest }: SessionFeedbackFormProps) {
  const { toast } = useToast();
  const [currentRating, setCurrentRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<SuggestLearningMaterialsOutput | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const form = useForm<SessionFeedbackFormValues>({
    resolver: zodResolver(sessionFeedbackSchema),
    defaultValues: {
      rating: 0,
      comments: "",
      topicsCovered: "",
    },
  });

  async function onSubmit(values: SessionFeedbackFormValues) {
    setIsSubmitting(true);
    setAiSuggestions(null);
    setShowAISuggestions(false);

    const feedbackData: SessionFeedback = {
      id: `fb_${Date.now()}`,
      requestId: tutoringRequest.id,
      studentId: student.id,
      tutorId: tutor.id,
      rating: values.rating,
      studentComments: values.comments,
      topicsCovered: values.topicsCovered,
      sessionDate: new Date().toISOString(),
    };

    console.log("Submitting session feedback:", feedbackData);
    
    // Simulate saving feedback
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Feedback envoyé",
      description: "Merci pour votre retour sur la session !",
    });

    // Trigger AI suggestion
    try {
      const aiInput: SuggestLearningMaterialsInput = {
        sessionFeedback: `Note: ${values.rating}/5. Commentaire: ${values.comments}. Sujets abordés: ${values.topicsCovered}`,
        studentLevel: student.level,
        tutorExperience: tutor.experience,
        module: tutoringRequest.subject,
      };
      console.log("AI Input:", aiInput);
      const suggestions = await suggestLearningMaterialsFlow(aiInput);
      console.log("AI Suggestions Output:", suggestions);
      if (suggestions && (suggestions.studentMaterials.length > 0 || suggestions.tutorMaterials.length > 0)) {
        setAiSuggestions(suggestions);
        setShowAISuggestions(true);
         toast({
          title: "Suggestions de matériel d'étude",
          description: "L'IA a généré des recommandations pour vous.",
        });
      } else {
        toast({
          title: "Suggestions de matériel d'étude",
          description: "L'IA n'a pas trouvé de suggestions pertinentes pour cette session.",
        });
      }
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      toast({
        title: "Erreur IA",
        description: "Impossible de générer les suggestions de matériel d'étude.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      form.reset(); // Reset form after submission
      setCurrentRating(0);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note de la session (1-5 étoiles)</FormLabel>
                <FormControl>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-8 w-8 cursor-pointer transition-colors ${
                          star <= currentRating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-muted-foreground hover:text-yellow-300"
                        }`}
                        onClick={() => {
                          setCurrentRating(star);
                          field.onChange(star);
                        }}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="topicsCovered"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sujets abordés pendant la session</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Algorithmes de tri, Révision du chapitre 3..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vos commentaires sur la session</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder="Comment s'est passée la session ? Le tuteur était-il clair ? Avez-vous progressé ?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? "Envoi en cours..." : "Envoyer le feedback"}
          </Button>
        </form>
      </Form>

      {showAISuggestions && aiSuggestions && (
        <div className="mt-12">
            <AISuggestionsDisplay suggestions={aiSuggestions} />
        </div>
      )}
    </>
  );
}
