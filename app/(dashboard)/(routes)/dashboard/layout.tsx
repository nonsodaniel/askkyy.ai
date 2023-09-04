import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React, { ReactNode } from "react";
interface IDashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: IDashboardLayoutProps) => {
  return (
    <div className="h-full relative">
      <div className="md:flex hidden h-full md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <Sidebar />
      </div>
      <main className="md:pl-72">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
