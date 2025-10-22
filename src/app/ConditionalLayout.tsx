"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, Library, User } from "lucide-react";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Routes that should not have header and footer
  const noHeaderFooterRoutes = ["/", "/login", "/login/otp"];
  const shouldShowHeaderFooter = !noHeaderFooterRoutes.includes(pathname);

  return (
    <>
      {/* Fixed Header - only show for certain routes */}
      {shouldShowHeaderFooter && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-bg/95 backdrop-blur-md border-b border-black/10 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="font-bold text-xl text-ink hover:text-ink/80 transition-colors"
            >
              AI Video
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                className="chip hover:bg-black/10 transition-colors"
                href="/"
              >
                Explore
              </Link>
              <Link
                className="chip hover:bg-black/10 transition-colors"
                href="/create"
              >
                Create
              </Link>
              <Link
                className="chip hover:bg-black/10 transition-colors"
                href="/library"
              >
                Library
              </Link>
              <Link
                className="chip hover:bg-black/10 transition-colors"
                href="/profile/me"
              >
                Profile
              </Link>
            </nav>

            <Link
              className="btn hover:opacity-80 transition-opacity"
              href="/create"
            >
              Generate
            </Link>
          </div>
        </header>
      )}

      {/* Main Content Area with Scroll */}
      <main
        className={`flex-1 flex flex-col ${
          shouldShowHeaderFooter ? "pt-16 pb-20 sm:pb-0" : ""
        } overflow-hidden`}
      >
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div
            className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${
              shouldShowHeaderFooter ? "py-6" : ""
            }`}
          >
            {children}
          </div>
        </div>
      </main>

      {/* Fixed Footer for Mobile - only show for certain routes */}
      {shouldShowHeaderFooter && (
        <footer className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg/95 backdrop-blur-md border-t border-black/10 shadow-lg">
          <nav className="mx-auto max-w-7xl px-4 grid grid-cols-4 gap-1 py-2">
            <Link
              href="/"
              className="text-center flex flex-col items-center gap-1 py-3 hover:bg-black/10 transition-colors rounded-lg"
            >
              <Home size={20} />
              <span className="text-xs font-medium">Home</span>
            </Link>
            <Link
              href="/create"
              className="text-center flex flex-col items-center gap-1 py-3 hover:bg-black/10 transition-colors rounded-lg"
            >
              <Plus size={20} />
              <span className="text-xs font-medium">Create</span>
            </Link>
            <Link
              href="/library"
              className="text-center flex flex-col items-center gap-1 py-3 hover:bg-black/10 transition-colors rounded-lg"
            >
              <Library size={20} />
              <span className="text-xs font-medium">Library</span>
            </Link>
            <Link
              href="/profile/me"
              className="text-center flex flex-col items-center gap-1 py-3 hover:bg-black/10 transition-colors rounded-lg"
            >
              <User size={20} />
              <span className="text-xs font-medium">Profile</span>
            </Link>
          </nav>
        </footer>
      )}
    </>
  );
}
