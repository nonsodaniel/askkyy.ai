import {
  CodeIcon,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Music,
  Settings,
  VideoIcon,
} from "lucide-react";
import * as z from "zod";

export const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-orange-700",
    bgColor: "bg-orange-700/10",
  },
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/conversation",
    color: "text-lime-500",
    bgColor: "bg-lime-500/10",
  },
  {
    label: "Image Generator",
    icon: ImageIcon,
    href: "/image",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    label: "Music Generator",
    icon: Music,
    href: "/music",
    color: "text-teal-200",
    bgColor: "bg-teal-200/10",
  },

  {
    label: "Video Generator",
    icon: VideoIcon,
    href: "/video",
    color: "text-blue-300",
    bgColor: "bg-blue-300/10",
  },
  {
    label: "Code Generator",
    icon: CodeIcon,
    href: "/code",
    color: "text-emerald-900",
    bgColor: "bg-emerald-900",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
];

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Prompt can not be empty",
  }),
});

export const MAX_FREE_COUNTS = 3;
