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
import type { TutorUser } from "@/lib/types";
import { Save } from "lucide-react";

const tutorProfileSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Adresse e-mail invalide." }),
  teachableSubjects: z.string().min(1, { message: "Veuillez indiquer au moins une matière." }), // Comma-separated string
  experience: z.string().min(1, { message: "Veuillez décrire votre expérience." }),
  availability: z.string().min(1, { message: "Veuillez indiquer vos disponibilités." }),
  bio: z.string().optional(),
});

type TutorProfileFormValues = z.infer<typeof tutorProfileSchema>;

interface TutorProfileFormProps {
  tutor: TutorUser; // Initial data
}

export default function TutorProfileForm({ tutor }: TutorProfileFormProps) {
  const { toast } = useToast();
  const form = useForm<TutorProfileFormValues>({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: {
      name: tutor.name || "",
      email: tutor.email || "",
      teachableSubjects: tutor.teachableSubjects?.join(", ") || "",
      experience: tutor.experience || "",
      availability: tutor.availability || "",
      bio: tutor.bio || "",
    },
  });

  async function onSubmit(values: TutorProfileFormValues) {
    // Simulate API call to update profile
    console.log("Updating tutor profile:", { ...values, id: tutor.id });
    const updatedProfile = {
      ...tutor,
      ...values,
      teachableSubjects: values.teachableSubjects.split(',').map(s => s.trim()).filter(s => s),
    };
    console.log("Updated tutor data (mock):", updatedProfile);

    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été enregistrées avec succès.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input placeholder="Votre nom et prénom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="exemple@etu.uae.ac.ma" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="teachableSubjects"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matières enseignées (séparées par une virgule)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Algorithmique, Bases de données" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expérience</FormLabel>
              <FormControl>
                <Textarea placeholder="Décrivez votre expérience en tant que tuteur..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disponibilités</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Lundis et Mercredis soirs, Weekends" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biographie (optionnel)</FormLabel>
              <FormControl>
                <Textarea placeholder="Parlez un peu de vous, de votre méthode d'enseignement..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Enregistrer les modifications
        </Button>
      </form>
    </Form>
  );
}
