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
import { Save } from "lucide-react";

const studentProfileSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Adresse e-mail invalide." }),
  program: z.string().min(1, { message: "Veuillez indiquer votre filière." }),
  level: z.string().min(1, { message: "Veuillez indiquer votre niveau." }),
  difficultSubjects: z.string().optional(), // Comma-separated string
});

type StudentProfileFormValues = z.infer<typeof studentProfileSchema>;

interface StudentProfileFormProps {
  student: StudentUser; // Initial data
}

export default function StudentProfileForm({ student }: StudentProfileFormProps) {
  const { toast } = useToast();
  const form = useForm<StudentProfileFormValues>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      name: student.name || "",
      email: student.email || "",
      program: student.program || "",
      level: student.level || "",
      difficultSubjects: student.difficultSubjects?.join(", ") || "",
    },
  });

  async function onSubmit(values: StudentProfileFormValues) {
    // Simulate API call to update profile
    console.log("Updating student profile:", { ...values, id: student.id });
    // Split difficultSubjects back into an array
    const updatedProfile = {
      ...student,
      ...values,
      difficultSubjects: values.difficultSubjects?.split(',').map(s => s.trim()).filter(s => s) || [],
    };
    console.log("Updated student data (mock):", updatedProfile);
    
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
          name="program"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Filière</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Génie Informatique" {...field} />
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
                <Input placeholder="Ex: 3ème année, Master 1" {...field} />
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
                <Textarea placeholder="Ex: Algorithmique, Mathématiques discrètes" {...field} />
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
