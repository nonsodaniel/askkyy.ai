import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  // a return ur that stripe needs because stripe has no idea where the app is hosted. The url gives it a direction to go back to the site
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}
