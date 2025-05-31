
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { StudentUser, TutorUser, SessionFeedback, TutoringRequest } from "@/lib/types";
import { Star, Send, Loader2 } from "lucide-react";
import { useState } from "react";

const sessionFeedbackSchema = z.object({
  rating: z.number().min(1, {message: "Veuillez sélectionner une note."}).max(5),
  comments: z.string().min(10, { message: "Veuillez fournir un commentaire d'au moins 10 caractères." }).optional().or(z.literal('')),
  topicsCovered: z.string().min(5, { message: "Veuillez lister les sujets abordés (min. 5 caractères)." }),
});

type SessionFeedbackFormValues = z.infer<typeof sessionFeedbackSchema>;

interface SessionFeedbackFormProps {
  student: StudentUser; 
  tutor: TutorUser;
  tutoringRequest: TutoringRequest;
  onFeedbackSubmitted?: () => void;
}

export default function SessionFeedbackForm({ student, tutor, tutoringRequest, onFeedbackSubmitted }: SessionFeedbackFormProps) {
  const { toast } = useToast();
  const [currentRating, setCurrentRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const feedbackData: Partial<SessionFeedback> = {
      requestId: tutoringRequest.id,
      studentId: student.id,
      tutorId: tutor.id,
      rating: values.rating,
      studentComments: values.comments,
      topicsCovered: values.topicsCovered,
      sessionDate: tutoringRequest.scheduledTime || new Date().toISOString(), // Use scheduledTime or fallback
    };

    try {
      const response = await fetch('/api/session-feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData),
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Erreur lors de l'envoi du feedback.");
      }

      toast({
        title: "Feedback envoyé",
        description: "Merci pour votre retour sur la session !",
      });
      
      form.reset({ rating: 0, comments: "", topicsCovered: "" });
      setCurrentRating(0);
      if (onFeedbackSubmitted) onFeedbackSubmitted();

    } catch (error) {
      console.error("Error submitting session feedback:", error);
      toast({
        title: "Erreur d'envoi",
        description: (error as Error).message || "Une erreur s'est produite.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
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
                        if (isSubmitting) return;
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
                <Input placeholder="Ex: Algorithmes de tri, Révision du chapitre 3..." {...field} disabled={isSubmitting}/>
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
              <FormLabel>Vos commentaires sur la session (optionnel)</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Comment s'est passée la session ? Le tuteur était-il clair ? Avez-vous progressé ?"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting || currentRating === 0} className="w-full sm:w-auto">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          {isSubmitting ? "Envoi en cours..." : "Envoyer le feedback"}
        </Button>
      </form>
    </Form>
  );
}
