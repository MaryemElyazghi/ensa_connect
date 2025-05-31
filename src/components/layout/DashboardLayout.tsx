"use client";
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpenText, LayoutDashboard, UserCircle, LogOut, ListChecks, CalendarClock, MessagePlus, Search, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: ('student' | 'tutor')[];
}

const navItems: NavItem[] = [
  { href: '/dashboard/student', label: 'Mon Tableau de Bord', icon: LayoutDashboard, roles: ['student'] },
  { href: '/dashboard/student/requests', label: 'Mes Demandes', icon: ListChecks, roles: ['student'] },
  { href: '/dashboard/student/new-request', label: 'Nouvelle Demande', icon: MessagePlus, roles: ['student'] },
  { href: '/find-tutor', label: 'Trouver un Tuteur', icon: Search, roles: ['student'] },

  { href: '/dashboard/tutor', label: 'Mon Tableau de Bord', icon: LayoutDashboard, roles: ['tutor'] },
  { href: '/dashboard/tutor/sessions', label: 'Mes Sessions', icon: CalendarClock, roles: ['tutor'] },
  { href: '/dashboard/tutor/availability', label: 'Mes Disponibilités', icon: CalendarClock, roles: ['tutor'] },
  
  { href: '/profile', label: 'Mon Profil', icon: UserCircle, roles: ['student', 'tutor'] },
  { href: '/session-feedback', label: 'Feedback Session', icon: Star, roles: ['student', 'tutor'] }, // Tutor might review feedback
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  const getInitials = (name: string = "Utilisateur Anonyme") => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const filteredNavItems = user ? navItems.filter(item => item.roles.includes(user.role as 'student' | 'tutor')) : [];

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><p>Chargement du tableau de bord...</p></div>;
  }

  if (!user) {
    router.push('/auth/login'); // Redirect if not logged in
    return <div className="flex items-center justify-center min-h-screen"><p>Redirection...</p></div>;
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className="items-center border-b border-sidebar-border">
           <Link href="/" className="flex items-center gap-2 p-2 overflow-hidden group-data-[collapsible=icon]:justify-center">
            <BookOpenText className="h-7 w-7 text-sidebar-primary shrink-0" />
            <span className="font-headline text-xl font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">ENSA Connect</span>
          </Link>
          <SidebarTrigger className="ml-auto group-data-[collapsible=icon]:hidden data-[collapsible=icon]:block" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {filteredNavItems.map(item => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border">
           <SidebarGroup className="p-0">
             <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton className="justify-start w-full" onClick={() => router.push('/profile')}>
                        <Avatar className="h-7 w-7 shrink-0 group-data-[collapsible=icon]:mx-auto">
                            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user avatar"/>
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
                            <span className="text-sm font-medium">{user.name}</span>
                            <span className="text-xs text-sidebar-foreground/70">{user.email}</span>
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} tooltip={{ children: "Déconnexion" }}>
                        <LogOut />
                        <span>Déconnexion</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarMenu>
           </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background">
        <div className="p-4 md:p-6 lg:p-8">
         {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
