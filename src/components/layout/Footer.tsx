export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ENSA Connect. Tous droits réservés.</p>
        <p className="mt-1">Une plateforme pour l'entraide et la réussite académique.</p>
      </div>
    </footer>
  );
}
