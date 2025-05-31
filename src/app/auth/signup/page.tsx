import AppLayout from '@/components/layout/AppLayout';
import SignupForm from '@/components/auth/SignupForm';
import { Suspense } from 'react';

function SignupPageContent() {
  return <SignupForm />;
}

export default function SignupPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex items-center justify-center">
        <Suspense fallback={<div>Chargement...</div>}>
          <SignupPageContent />
        </Suspense>
      </div>
    </AppLayout>
  );
}
