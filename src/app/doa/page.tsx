import type { Metadata } from "next";
import Link from "next/link";
import { DuaCollection } from "@/components/dua-collection";
import { ArrowLeftIcon } from "@/components/icons";
import { LinkPending } from "@/components/link-pending";

export const metadata: Metadata = { title: "Kumpulan Doa · Teman Umrohku" };

export default function DuaPage() {
  return (
    <main className="pt-safe pb-safe mx-auto max-w-xl px-4 pb-10">
      <header className="flex items-center gap-3 py-4">
        <Link
          href="/"
          aria-label="Kembali ke beranda"
          className="relative -ml-2 flex size-11 items-center justify-center rounded-full bg-background active:bg-surface-muted"
        >
          <ArrowLeftIcon className="size-6" />
          <LinkPending />
        </Link>
        <h1 className="font-display text-3xl">Kumpulan doa</h1>
      </header>
      <DuaCollection />
    </main>
  );
}
