import { cn } from "@/lib/utils";
import {
  ImageIcon,
  LucideIcon as Icon,
  MessageSquareIcon,
  XIcon,
} from "lucide-react";
import React from "react";
interface IHeaderProps {
  title: string;
  description: string;
  icon: Icon;
  iconColor?: string;
  bgColor: string;
}

const Header = ({
  title,
  description,
  icon: LucideIcon,
  iconColor,
  bgColor,
}: IHeaderProps) => {
  return (
    <>
      <div className="px-4 lg:px-8 flex items-center gap-x-3 mb-8">
        <div className={cn("p-2 w-fit rounded-md", bgColor)}>
          <LucideIcon className={cn("w-10 h-10", iconColor)} />
        </div>
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </>
  );
};

export default Header;
