import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "AI Video",
  description: "Simple AI video creation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur border-b border-black/10">
          <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold">
              AI Video
            </Link>
            <nav className="hidden sm:flex gap-2">
              <Link className="chip" href="/">
                Explore
              </Link>
              <Link className="chip" href="/create">
                Create
              </Link>
              <Link className="chip" href="/library">
                Library
              </Link>
              <Link className="chip" href="/profile/me">
                Profile
              </Link>
            </nav>
            <Link className="btn" href="/create">
              Generate
            </Link>
          </div>
        </header>

        <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6">
          {children}
        </main>

        <footer className="sm:hidden sticky bottom-0 bg-bg border-t border-black/10">
          <nav className="mx-auto max-w-5xl grid grid-cols-4 gap-1 p-2 text-xs">
            <Link href="/" className="chip text-center">
              Home
            </Link>
            <Link href="/create" className="chip text-center">
              Create
            </Link>
            <Link href="/library" className="chip text-center">
              Library
            </Link>
            <Link href="/profile/me" className="chip text-center">
              Profile
            </Link>
          </nav>
        </footer>
      </body>
    </html>
  );
}
