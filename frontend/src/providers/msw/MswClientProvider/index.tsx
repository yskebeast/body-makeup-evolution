"use client";
import { use } from "react";

const mockingEnabledPromise =
  typeof window !== "undefined"
    ? import("@/msw/browser").then(async ({ worker }) => {
        await worker.start({ onUnhandledRequest: "bypass" });
      })
    : Promise.resolve();

export const MswClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  use(mockingEnabledPromise);
  return children;
};
