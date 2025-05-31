
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
import type { StudentUser } from "@/lib/types";
import { Send, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const tutoringRequestSchema = z.object({
  subject: z.string().min(1, { message: "Veuillez indiquer la matière." }),
  level: z.string().min(1, { message: "Veuillez indiquer votre niveau actuel pour cette matière." }),
  description: z.string().min(10, { message: "Veuillez décrire plus en détail vos difficultés (min. 10 caractères)." }),
  studentAvailability: z.string().min(1, { message: "Veuillez indiquer vos disponibilités." }),
});

type TutoringRequestFormValues = z.infer<typeof tutoringRequestSchema>;

interface TutoringRequestFormProps {
  student: StudentUser;
}

export default function TutoringRequestForm({ student }: TutoringRequestFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TutoringRequestFormValues>({
    resolver: zodResolver(tutoringRequestSchema),
    defaultValues: {
      subject: "",
      level: student.level || "", 
      description: "",
      studentAvailability: "",
    },
  });

  async function onSubmit(values: TutoringRequestFormValues) {
    setIsSubmitting(true);
    try {
      const payload = {
        studentId: student.id,
        studentName: student.name,
        ...values,
      };

      const response = await fetch('/api/tutoring-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la création de la demande.");
      }
      
      toast({
        title: "Demande de tutorat envoyée",
        description: "Votre demande a été soumise. Vous pouvez la consulter dans 'Mes Demandes'.",
      });
      router.push(`/dashboard/student/requests`);
    } catch (error) {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matière</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Mathématiques, Algorithmique" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Votre niveau actuel dans cette matière</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Débutant, Intermédiaire, 1ère année..." {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description de vos besoins</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="Décrivez les chapitres ou concepts spécifiques avec lesquels vous avez besoin d'aide..." {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="studentAvailability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vos disponibilités</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Lundis et Mercredis après 18h, Samedi matin" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
        </Button>
      </form>
    </Form>
  );
}
