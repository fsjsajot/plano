import { Link } from "react-router-dom";

export const AppHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <header className="z-10 sticky top-0 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          plano
          <span className="sr-only">Acme Inc</span>
        </Link>
      </nav>

      {children}
    </header>
  );
};
