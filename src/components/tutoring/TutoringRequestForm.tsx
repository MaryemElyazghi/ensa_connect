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
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";

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

  const form = useForm<TutoringRequestFormValues>({
    resolver: zodResolver(tutoringRequestSchema),
    defaultValues: {
      subject: "",
      level: student.level || "", // Pre-fill with student's general level
      description: "",
      studentAvailability: "",
    },
  });

  async function onSubmit(values: TutoringRequestFormValues) {
    // Simulate API call to create tutoring request
    const newRequest = {
      id: `req_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      ...values,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };
    console.log("Creating tutoring request:", newRequest);
    
    // Add to a mock list of requests (e.g., in localStorage or context for demo)
    // For now, just show a toast and redirect.
    
    toast({
      title: "Demande de tutorat envoyée",
      description: "Votre demande a été soumise. Nous vous notifierons lorsqu'un tuteur sera trouvé.",
    });
    // Redirect to a page where student can see their requests or to find-tutor to see matches
    router.push(`/find-tutor?subject=${encodeURIComponent(values.subject)}&level=${encodeURIComponent(values.level)}`);
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
                <Input placeholder="Ex: Mathématiques, Algorithmique" {...field} />
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
                <Input placeholder="Ex: Débutant, Intermédiaire, 1ère année..." {...field} />
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
                <Textarea rows={4} placeholder="Décrivez les chapitres ou concepts spécifiques avec lesquels vous avez besoin d'aide..." {...field} />
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
                <Input placeholder="Ex: Lundis et Mercredis après 18h, Samedi matin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-auto">
          <Send className="mr-2 h-4 w-4" />
          Envoyer la demande
        </Button>
      </form>
    </Form>
  );
}
