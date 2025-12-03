import { memo } from "react";
import { Header } from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { BottomNavigation } from "../components/layout/BottomNavigation";
import { SidebarProvider } from "../contexts/SidebarContext";

interface RootDashboardLayoutProps {
  children: React.ReactNode;
}

export const RootDashboardLayout = memo(function RootDashboardLayout({ children }: RootDashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="h-screen flex flex-col bg-[#F7F9FF] overflow-x-hidden">
        {/* Header */}
        <Header />
        
        {/* Main layout with sidebar and content */}
        <div className="flex flex-1 min-h-0 gap-4 p-4">
          {/* Sidebar */}
          <Sidebar />

          {/* Content area */}
          <main className="flex-1 min-w-0 overflow-y-auto">
            <div className="h-full">
              {children}
            </div>
          </main>
        </div>

        {/* Bottom Navigation (mobile only) */}
        <BottomNavigation />
      </div>
    </SidebarProvider>
  );
});