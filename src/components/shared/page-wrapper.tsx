import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";

type PageWrapperProps = {
  children: React.ReactNode;
};

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
