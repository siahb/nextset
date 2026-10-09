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
  // Apply the shared cookie preference before paint to avoid a light/dark flash.
  return (
    // eslint-disable-next-line @next/next/no-sync-scripts
    <html lang="en" data-theme="system" suppressHydrationWarning><head><script src="/siahverse-theme.js?v=20261009-stars" /></head>
      <body className="antialiased">{children}<footer style={{textAlign:"center",padding:"16px"}}><a href="https://siahverse.cc/changelog/#nextset">Release history</a></footer></body>
    </html>
  );
}
