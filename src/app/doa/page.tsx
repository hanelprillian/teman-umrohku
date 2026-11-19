import type { Metadata } from "next";
import Link from "next/link";
import { DuaCollection } from "@/components/dua-collection";
import { ArrowLeftIcon } from "@/components/icons";
import { LinkPending } from "@/components/link-pending";

export const metadata: Metadata = { title: "Kumpulan Doa · Teman Umrohku" };

export default function DuaPage() {
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
        <h1 className="text-xl font-semibold tracking-tight">Kumpulan doa</h1>
      </header>
      <DuaCollection />
    </main>
  );
}
