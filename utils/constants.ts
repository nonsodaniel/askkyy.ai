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
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/conversation",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    label: "Image Generator",
    icon: ImageIcon,
    href: "/image",
    color: "text-orange-500",
    bgColor: "bg-emerald-500/10",
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

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Prompt can not be empty",
  }),
});

export const conversationList = [
  { content: "A colorful painting of a serene landscape.", role: "user" },
  { content: "An important memo about the upcoming meeting.", role: "admin" },
  {
    content: "A recipe for delicious homemade chocolate chip cookies.",
    role: "user",
  },
  { content: "Confidential financial report for Q3.", role: "admin" },
  { content: "A funny meme that made me laugh out loud.", role: "user" },
  { content: "Security protocol documentation for the server.", role: "admin" },
  {
    content: "Notes from yesterday's team brainstorming session.",
    role: "user",
  },
  { content: "Access control list for the company's network.", role: "admin" },
  { content: "A cute picture of a fluffy kitten.", role: "user" },
  {
    content: "Emergency evacuation plan for the office building.",
    role: "admin",
  },
];
