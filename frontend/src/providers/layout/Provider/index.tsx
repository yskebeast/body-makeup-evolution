import { MswProvider } from "@/providers/msw/MswProvider";
import { TanstackProvider } from "@/providers/tanstack/TanstackProvider";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MswProvider>
      <TanstackProvider>
        <>{children}</>
      </TanstackProvider>
    </MswProvider>
  );
};
