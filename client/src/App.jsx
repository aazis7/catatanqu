import Home from "@/pages/home";
import RootLayout from "@/pages/layout";
import NotFound from "@/pages/not-found";
import { Route, Routes } from "react-router";

import { ThemeProvider } from "./context/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" Component={RootLayout}>
          <Route index Component={Home} />
        </Route>
        <Route path="*" Component={NotFound} />
      </Routes>
    </ThemeProvider>
  );
}
