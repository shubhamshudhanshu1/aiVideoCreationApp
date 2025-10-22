import "./globals.css";
import ConditionalLayout from "@/app/ConditionalLayout";

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
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col bg-bg text-ink overflow-hidden">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
