import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
import { LinkPending } from "@/components/link-pending";
import { SettingsPanel } from "@/components/settings-panel";

export const metadata: Metadata = { title: "Pengaturan · Teman Umrohku" };

export default function SettingsPage() {
  return (
    <main className="pt-safe pb-safe mx-auto max-w-xl px-5 pb-12">
      <header className="flex items-center gap-3 py-5">
        <Link
          href="/"
          aria-label="Kembali ke beranda"
          className="relative flex size-10 items-center justify-center rounded-full border border-border bg-surface text-foreground active:bg-surface-muted"
        >
          <ArrowLeftIcon className="size-5" />
          <LinkPending />
        </Link>
        <h1 className="text-xl font-semibold tracking-tight">Pengaturan</h1>
      </header>
      <SettingsPanel />
    </main>
  );
}
