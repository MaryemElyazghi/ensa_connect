
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
import type { TutorUser, User } from "@/lib/types";
import { Save, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

const tutorProfileSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Adresse e-mail invalide." }),
  teachableSubjects: z.string().min(1, { message: "Veuillez indiquer au moins une matière." }), // Comma-separated string
  experience: z.string().min(1, { message: "Veuillez décrire votre expérience." }),
  availability: z.string().min(1, { message: "Veuillez indiquer vos disponibilités." }),
  bio: z.string().optional(),
  avatarUrl: z.string().url({ message: "Veuillez entrer une URL valide pour l'avatar." }).optional().or(z.literal('')),
});

type TutorProfileFormValues = z.infer<typeof tutorProfileSchema>;

interface TutorProfileFormProps {
  tutor: TutorUser;
  onProfileUpdate: (updatedUser: User) => void;
}

export default function TutorProfileForm({ tutor, onProfileUpdate }: TutorProfileFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TutorProfileFormValues>({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: {
      name: tutor.name || "",
      email: tutor.email || "",
      teachableSubjects: tutor.teachableSubjects?.join(", ") || "",
      experience: tutor.experience || "",
      availability: tutor.availability || "",
      bio: tutor.bio || "",
      avatarUrl: tutor.avatarUrl || "",
    },
  });

  useEffect(() => {
    form.reset({
      name: tutor.name || "",
      email: tutor.email || "",
      teachableSubjects: tutor.teachableSubjects?.join(", ") || "",
      experience: tutor.experience || "",
      availability: tutor.availability || "",
      bio: tutor.bio || "",
      avatarUrl: tutor.avatarUrl || "",
    });
  }, [tutor, form]);

  async function onSubmit(values: TutorProfileFormValues) {
    setIsLoading(true);
    try {
      const teachableSubjectsArray = values.teachableSubjects.split(',').map(s => s.trim()).filter(s => s);
      const payload = {
        ...values,
        teachableSubjects: teachableSubjectsArray,
        role: 'tutor', // Ensure role is passed for backend logic if needed
      };

      const response = await fetch(`/api/profile/${tutor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const updatedUserData = await response.json();

      if (!response.ok) {
        throw new Error(updatedUserData.message || "Erreur lors de la mise à jour du profil.");
      }
      
      onProfileUpdate(updatedUserData as User); // Update AuthContext
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
      });

    } catch (error) {
      toast({
        title: "Erreur de mise à jour",
        description: (error as Error).message || "Une erreur s'est produite.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
                <Input placeholder="Votre nom et prénom" {...field} disabled={isLoading}/>
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
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de l'avatar (optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="https://exemple.com/avatar.png" {...field} disabled={isLoading} />
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
                <Input placeholder="Ex: Algorithmique, Bases de données" {...field} disabled={isLoading}/>
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
                <Textarea placeholder="Décrivez votre expérience en tant que tuteur..." {...field} disabled={isLoading}/>
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
                <Input placeholder="Ex: Lundis et Mercredis soirs, Weekends" {...field} disabled={isLoading}/>
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
                <Textarea placeholder="Parlez un peu de vous, de votre méthode d'enseignement..." {...field} disabled={isLoading}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </form>
    </Form>
  );
}
