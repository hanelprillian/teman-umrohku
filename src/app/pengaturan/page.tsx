import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
import { LinkPending } from "@/components/link-pending";
import { SettingsPanel } from "@/components/settings-panel";

export const metadata: Metadata = { title: "Pengaturan · Teman Umrohku" };

export default function SettingsPage() {
  return (
    <main className="pt-safe pb-safe mx-auto max-w-xl px-4 pb-10">
      <header className="flex items-center gap-3 py-4">
        <Link
          href="/"
          aria-label="Kembali ke beranda"
          className="relative -ms-1 flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-xs transition-colors hover:bg-muted active:bg-muted"
        >
          <ArrowLeftIcon className="size-5" />
          <LinkPending />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Pengaturan</h1>
      </header>
      <SettingsPanel />
    </main>
  );
}
