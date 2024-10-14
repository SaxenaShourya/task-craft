import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

const PlatformLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ClerkProvider>
      {children}
      <Toaster />
    </ClerkProvider>
  );
}

export default PlatformLayout;