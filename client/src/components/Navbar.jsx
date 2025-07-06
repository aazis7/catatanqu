import { Button } from "@/components/ui/button";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router";

import { useMobileMenu } from "../hooks/useMobileMenu";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const { isOpen, toggle, close } = useMobileMenu();

  const navLinks = [
    {
      to: "/",
      title: "Home",
    },
    {
      to: "/notes",
      title: "Catatan",
    },
    {
      to: "/settings",
      title: "Settings",
    },
  ];

  return (
    <nav className="flex items-center justify-between mx-auto w-full max-w-2xl">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggle}
          aria-label="Toggle mobile menu"
        >
          {isOpen ? <HiX className="size-5" /> : <HiMenu className="size-5" />}
        </Button>

        {/* Brand Title */}
        <Link to="/" className="font-bold text-2xl scroll-m-20 tracking-tight">
          CatatanQu
        </Link>
      </div>

      {/* Desktop Navigation - Center/Hidden on Mobile */}
      <ul className="hidden md:flex items-center gap-3">
        {navLinks.map((link) => (
          <li key={link.title}>
            <Link to={link.to} className="text-sm tracking-tight">
              {link.title}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Profile Button - Add your profile button here */}
        <Button variant="ghost" size="icon" className="hidden md:inline-flex">
          {/* Add your profile icon here */}
          <span className="size-5">👤</span>
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/50 backdrop-blur-md z-40 md:hidden"
          onClick={close}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-background shadow-lg transform transition-transform duration-300 z-50 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={close}
            aria-label="Close mobile menu"
          >
            <HiX className="size-5" />
          </Button>

          <div className="mt-8">
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    to={link.to}
                    className="block text-sm tracking-tight py-2"
                    onClick={close}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Profile Section */}
            <div className="mt-6 pt-4 border-t">
              <Button variant="ghost" className="w-full justify-start">
                <span className="size-5 mr-2">👤</span>
                Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
