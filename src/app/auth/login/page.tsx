import AppLayout from '@/components/layout/AppLayout';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex items-center justify-center">
        <LoginForm />
      </div>
    </AppLayout>
  );
}
