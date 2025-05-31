
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
import type { StudentUser, User } from "@/lib/types";
import { Save, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

const studentProfileSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Adresse e-mail invalide." }),
  program: z.string().min(1, { message: "Veuillez indiquer votre filière." }),
  level: z.string().min(1, { message: "Veuillez indiquer votre niveau." }),
  difficultSubjects: z.string().optional(), // Comma-separated string
  avatarUrl: z.string().url({ message: "Veuillez entrer une URL valide pour l'avatar." }).optional().or(z.literal('')),
});

type StudentProfileFormValues = z.infer<typeof studentProfileSchema>;

interface StudentProfileFormProps {
  student: StudentUser;
  onProfileUpdate: (updatedUser: User) => void;
}

export default function StudentProfileForm({ student, onProfileUpdate }: StudentProfileFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<StudentProfileFormValues>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      name: student.name || "",
      email: student.email || "",
      program: student.program || "",
      level: student.level || "",
      difficultSubjects: student.difficultSubjects?.join(", ") || "",
      avatarUrl: student.avatarUrl || "",
    },
  });
  
  useEffect(() => {
    form.reset({
      name: student.name || "",
      email: student.email || "",
      program: student.program || "",
      level: student.level || "",
      difficultSubjects: student.difficultSubjects?.join(", ") || "",
      avatarUrl: student.avatarUrl || "",
    });
  }, [student, form]);


  async function onSubmit(values: StudentProfileFormValues) {
    setIsLoading(true);
    try {
      const difficultSubjectsArray = values.difficultSubjects?.split(',').map(s => s.trim()).filter(s => s) || [];
      const payload = {
        ...values,
        difficultSubjects: difficultSubjectsArray,
        role: 'student', // Ensure role is passed for backend logic if needed
      };

      const response = await fetch(`/api/profile/${student.id}`, {
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
                <Input placeholder="Votre nom et prénom" {...field} disabled={isLoading} />
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
          name="program"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Filière</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Génie Informatique" {...field} disabled={isLoading} />
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
              <FormLabel>Niveau d'études</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 3ème année, Master 1" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="difficultSubjects"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matières en difficulté (séparées par une virgule)</FormLabel>
              <FormControl>
                <Textarea placeholder="Ex: Algorithmique, Mathématiques discrètes" {...field} disabled={isLoading} />
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
