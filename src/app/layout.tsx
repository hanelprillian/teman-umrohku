import type { Metadata, Viewport } from "next";
import { Scheherazade_New } from "next/font/google";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { SettingsSync } from "@/components/settings-sync";
import { settingsInlineScript } from "@/lib/settings-store";
import "./globals.css";

const scheherazade = Scheherazade_New({
  variable: "--font-scheherazade",
  weight: ["400", "700"],
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "Teman Umrohku",
  description: "Teman di saku saat umroh: langkah, doa, dan dalilnya.",
  applicationName: "Teman Umrohku",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Teman Umrohku",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f5f2",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      data-theme="light"
      suppressHydrationWarning
      className={`${scheherazade.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: settingsInlineScript }} />
      </head>
      <body className="min-h-full bg-background font-sans text-foreground">
        {children}
        <SettingsSync />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
