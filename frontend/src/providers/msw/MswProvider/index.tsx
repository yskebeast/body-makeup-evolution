import { Suspense, type ReactNode } from "react";
import { MswClientProvider } from "../MswClientProvider";

if (
  process.env.NEXT_RUNTIME === "nodejs" &&
  process.env.NEXT_PUBLIC_MSW_ENABLE === "true"
) {
  const { server } = await import("@/msw/server");
  server.listen({ onUnhandledRequest: "bypass" });
  console.log("🚀 Mock Service Worker is running 🚀");
}

const LoadingFallback = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Loading...</h3>
          <p className="text-sm text-gray-500">
            Setting up mock service worker
          </p>
        </div>
      </div>
    </div>
  );
};

export const MswProvider = ({ children }: { children: ReactNode }) => {
  if (process.env.NEXT_PUBLIC_MSW_ENABLE !== "true") {
    return children;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <MswClientProvider>{children}</MswClientProvider>
    </Suspense>
  );
};
