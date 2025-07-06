import { Suspense } from "react";
import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <Suspense>
      <Outlet />
    </Suspense>
  );
}
