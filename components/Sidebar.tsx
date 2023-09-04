"use client";
import { cn } from "@/lib/utils";
import {
  CodeIcon,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Music,
  Settings,
  VideoIcon,
} from "lucide-react";
import { Montserrat, Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const monsterat = Poppins({
  weight: "600",
  subsets: ["latin"],
});

const Sidebar = () => {
  const pathName = usePathname();
  const activePathColor = (href: string) =>
    href === pathName ? "text-white bg-white/10" : "text-zinc-100";

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-green-500",
    },
    {
      label: "Conversation",
      icon: MessageSquare,
      href: "/converations",
      color: "text-yellow-500",
    },
    {
      label: "Image Generator",
      icon: ImageIcon,
      href: "/image",
      color: "text-orange-500",
    },
    {
      label: "Music Generator",
      icon: Music,
      href: "/music",
      color: "text-orange-500",
    },

    {
      label: "Video Generator",
      icon: VideoIcon,
      href: "/video",
      color: "text-red-500",
    },
    {
      label: "Code Generator",
      icon: CodeIcon,
      href: "/code",
      color: "text-purple-300",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      color: "text-pink-300",
    },
  ];
  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#625df5b3] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href={"/dashboard"} className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
            <Image alt="logo" src="/logo.png" fill />
          </div>
          <h1 className={cn(`text-2xl font-bold`, monsterat.className)}>
            Askkyy
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
    </div>
  );
};

export default Sidebar;
