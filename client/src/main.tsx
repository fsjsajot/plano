import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import "@fontsource-variable/inter";

import App from "./App.tsx";
import "./index.css";
import { queryConfig } from "./lib/react-query.ts";

export const queryClient = new QueryClient({
  defaultOptions: {
    ...queryConfig,
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster richColors position="top-center" />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>
);
