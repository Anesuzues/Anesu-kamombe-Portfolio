import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CyberSidebar } from "@/components/CyberSidebar";
import { SECTIONS } from "@/lib/sections";

const SceneBackground = lazy(() => import("@/components/3d/SceneBackground"));
const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider defaultOpen={true}>
          <div className="min-h-screen flex w-full bg-background">
            <Suspense fallback={null}>
              <SceneBackground />
            </Suspense>
            <CyberSidebar />
            <SidebarInset className="relative z-10 bg-transparent">
              <Suspense fallback={<div className="min-h-screen" />}>
                <Routes>
                  {SECTIONS.map(({ path }) => (
                    <Route key={path} path={path} element={<Home />} />
                  ))}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;