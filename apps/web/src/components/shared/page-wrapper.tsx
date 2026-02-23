import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <main className="relative flex min-h-dvh w-full min-w-0 flex-col items-center justify-center overflow-x-hidden px-4 py-16 pb-20 sm:px-6 sm:py-20 sm:pb-24">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
