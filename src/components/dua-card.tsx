import type { Dua } from "@/content/types";
import { DalilList } from "./dalil";

export const DuaCard = ({ dua }: { dua: Dua }) => (
  <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
    {(dua.title || dua.repeat) && (
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface-muted px-4 py-2.5">
        {dua.title && <h3 className="text-sm font-semibold">{dua.title}</h3>}
        {dua.repeat && (
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
            {dua.repeat}
          </span>
        )}
      </header>
    )}
    <div className="space-y-3 px-4 py-4">
      <p dir="rtl" lang="ar" className="text-arabic text-right">
        {dua.arabic}
      </p>
      <p className="latin-text text-reading font-medium italic text-primary-strong">
        {dua.latin}
      </p>
      <p className="translation-text text-reading text-muted">
        “{dua.translation}”
      </p>
    </div>
    <footer className="border-t border-border px-4 py-3">
      <DalilList items={dua.dalil} />
    </footer>
  </article>
);
