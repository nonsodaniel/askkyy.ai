"use client";
import { cn } from "@/lib/utils";

import { Poppins } from "next/font/google";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { routes } from "@/utils/constants";
import { FreeCounter } from "./FreeCounter";

const monsterat = Poppins({
  weight: "600",
  subsets: ["latin"],
});

interface ISidebarProps {
  apiLimitCount: number;
  isPro: boolean;
}
const Sidebar = ({ apiLimitCount = 0, isPro }: ISidebarProps) => {
  const pathName = usePathname();
  const activePathColor = (href: string) =>
    href === pathName ? "text-white bg-white/10" : "text-zinc-100";

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#625df5b3] text-white">
      <div className="px-3 py-2 flex-1">
        <Link
          href={"/dashboard"}
          className="flex items-center justify-center pl-3 mb-14"
        >
          <h1 className={cn(`font-bold text-center`, monsterat.className)}>
            <span className="text-4xl font-extrabold text-orange-400">
              Askkyy
            </span>
            <span>.ai</span>
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                `flex justify-start  font-medium p-3 w-full cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition 
              `,
                activePathColor(route.href)
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      {!isPro && <FreeCounter apiLimitCount={apiLimitCount} isPro={false} />}
    </div>
  );
};

export default Sidebar;
