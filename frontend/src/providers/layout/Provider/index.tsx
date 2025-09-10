import { MswProvider } from "@/providers/msw/MswProvider";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MswProvider>
      <>{children}</>
    </MswProvider>
  );
};
