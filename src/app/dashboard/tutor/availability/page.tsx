"use client";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar'; // Assuming a more complex calendar might be used later
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { TutorUser } from '@/lib/types';

const availabilitySchema = z.object({
  availabilityText: z.string().min(5, { message: "Veuillez décrire vos disponibilités (min. 5 caractères)." }),
  // Potentially add structured availability later, e.g. specific time slots
});

type AvailabilityFormValues = z.infer<typeof availabilitySchema>;

export default function TutorAvailabilityPage() {
  const { user } = useAuth(); // Assuming user details (like current availability) are in context
  const { toast } = useToast();

  const currentTutor = user as TutorUser | null; // Cast if sure, or handle null

  const form = useForm<AvailabilityFormValues>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      availabilityText: currentTutor?.availability || "",
    },
  });

  function onSubmit(values: AvailabilityFormValues) {
    console.log("Updating availability:", values);
    // Here, you would make an API call to save the tutor's availability
    // For demo, we'll just show a toast
    toast({
      title: "Disponibilités mises à jour",
      description: "Vos nouvelles disponibilités ont été enregistrées.",
    });
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-headline text-3xl font-bold text-foreground">Gérer mes Disponibilités</h1>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Définir vos créneaux</CardTitle>
            <CardDescription>
              Indiquez quand vous êtes disponible pour donner des cours. Soyez aussi précis que possible.
              Vous pouvez décrire vos disponibilités générales ci-dessous.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="availabilityText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description de vos disponibilités</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={4} 
                          placeholder="Ex: Lundi de 18h à 20h, Mercredi toute la journée, Weekends sur demande..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* 
                Placeholder for a more advanced calendar/slot picker if needed in the future
                <div>
                  <FormLabel>Ou sélectionnez des créneaux spécifiques :</FormLabel>
                  <Calendar mode="multiple" className="rounded-md border mt-2" />
                  <p className="text-sm text-muted-foreground mt-2">Fonctionnalité de calendrier avancée à venir.</p>
                </div>
                */}
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> Enregistrer les disponibilités
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-xl">Synchronisation Calendrier (Prochainement)</CardTitle>
                <CardDescription>
                    Connectez votre Google Calendar pour gérer automatiquement vos disponibilités et éviter les conflits.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" disabled>Connecter Google Calendar</Button>
            </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}
