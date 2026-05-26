import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata = {
  title: "LearnNext School ERP",
  description: "School management ERP MVP built with Next.js + Express.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-body text-foreground antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
