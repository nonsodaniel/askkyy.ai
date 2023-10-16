import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React, { ReactNode } from "react";

import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
interface IDashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = async ({ children }: IDashboardLayoutProps) => {
  const apiLimitiCount = await getApiLimitCount();
  const isPro = await checkSubscription();

  return (
    <div className="h-full relative">
      <div className="md:flex hidden h-full md:w-72 md:flex-col md:fixed md:inset-y-0  bg-gray-900">
        <Sidebar apiLimitCount={apiLimitiCount} isPro={isPro} />
      </div>
      <main className="md:pl-72">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
