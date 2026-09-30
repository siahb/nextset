import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PPL at Home · NextSet",
  description: "Your return to lifting. Track sets, reps, and effort at home.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="system" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html: "(()=>{try{const p=localStorage.getItem('nextset-appearance');document.documentElement.dataset.theme=p==='light'||p==='dark'?p:'system'}catch{}})()"}} /></head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
