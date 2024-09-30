import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCallback, useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import { navbarItems } from "@/features/app/dashboard/data";

export const SidebarNav = () => {
  const { pathname } = useLocation();
  const { workspaceId } = useParams();

  const isActivePathStyle = useCallback(
    (href: string) => {
      if (pathname === href) return "default";

      return "ghost";
    },
    [pathname]
  );

  const links = useMemo(() => {
    if (workspaceId) {
      return navbarItems(workspaceId);
    }

    return [];
  }, [workspaceId]);

  return (
    <div className="flex flex-col gap-4 py-2">
      <nav className="grid gap-1 px-2">
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.href}
            className={cn(
              buttonVariants({
                variant: isActivePathStyle(link.href),
                size: "sm",
              }),
              isActivePathStyle(link.href) === "default" &&
                "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
              "justify-start"
            )}
          >
            {link.icon && <link.icon className="mr-2 h-4 w-4" />}
            {link.title}
          </Link>
        ))}
      </nav>
    </div>
  );
};
