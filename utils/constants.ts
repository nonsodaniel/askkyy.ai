import {
  CodeIcon,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Music,
  Settings,
  VideoIcon,
} from "lucide-react";

export const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/converations",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    label: "Image Generator",
    icon: ImageIcon,
    href: "/image",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    label: "Music Generator",
    icon: Music,
    href: "/music",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },

  {
    label: "Video Generator",
    icon: VideoIcon,
    href: "/video",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    label: "Code Generator",
    icon: CodeIcon,
    href: "/code",
    color: "text-purple-300",
    bgColor: "bg-purple-500/10",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-pink-300",
    bgColor: "bg-pink-500/10",
  },
];
