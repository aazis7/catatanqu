import { ErrorBoundary } from "@/components/ErrorBoundary";
import RootLayout from "@/pages/layout";

/** @type {import("react-router").RouteObject[]}*/
export default [
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorBoundary,
    children: [
      {
        index: true,
        loader: async () => {
          const message = "Welcome!";

          return { message };
        },
        lazy: async () => ({
          Component: (await import("./pages/home.jsx")).default,
        }),
      },
    ],
  },
];
