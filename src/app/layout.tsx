import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Scheherazade_New } from "next/font/google";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { SettingsSync } from "@/components/settings-sync";
import { settingsInlineScript } from "@/lib/settings-store";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
});

const scheherazade = Scheherazade_New({
  variable: "--font-scheherazade",
  weight: ["400", "700"],
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "Panduan Umroh",
  description:
    "Panduan umroh langkah demi langkah: tawaf, sa'i, doa, dan dalilnya.",
  applicationName: "Panduan Umroh",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Umroh",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf7f0",
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
      className={`${jakarta.variable} ${scheherazade.variable} h-full antialiased`}
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
