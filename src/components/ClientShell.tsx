"use client";

import { ToastProvider } from "@/components/Toast";
import ScrollToTop from "@/components/ScrollToTop";
import PageTransition from "@/components/PageTransition";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <PageTransition>{children}</PageTransition>
      <ScrollToTop />
    </ToastProvider>
  );
}
