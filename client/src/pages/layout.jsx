import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 py-3 lg:p-6 border-b">
        <Navbar />
      </header>
      <main className="flex-1 px-4 py-6 lg:px-6 lg:py-8">
        <Outlet />
      </main>
      <footer className="px-4 py-3 lg:p-6 border-t">
        <Footer />
      </footer>
    </div>
  );
}
