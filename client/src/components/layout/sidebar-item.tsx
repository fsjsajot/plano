import { Link } from "react-router-dom";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  href: string;
  title?: string;
  className?: string;
  children: React.ReactNode;
  isActivePathStyle?: (href: string) => "ghost" | "default";
}

export const SidebarItem = ({
  href,
  title,
  children,
  isActivePathStyle,
  className = "",
}: SidebarItemProps) => {
  return (
    <Link
      to={href}
      title={title}
      className={cn(
        buttonVariants({
          variant: isActivePathStyle?.(href) || "ghost",
          size: "sm",
        }),
        isActivePathStyle?.(href) === "default" &&
          "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
        "justify-start",
        className
      )}
    >
      {children}
    </Link>
  );
};
