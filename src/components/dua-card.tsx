import type { Dua } from "@/content/types";
import { DalilList } from "./dalil";

export const DuaCard = ({ dua }: { dua: Dua }) => (
  <article className="nusuk-card overflow-hidden rounded-[22px]">
    {(dua.title || dua.repeat) && (
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface-muted/45 px-5 py-3">
        {dua.title && (
          <h3 className="text-sm font-semibold text-foreground">{dua.title}</h3>
        )}
        {dua.repeat && (
          <span className="rounded-full bg-gold-soft px-2.5 py-0.5 text-xs font-medium text-gold">
            {dua.repeat}
          </span>
        )}
      </header>
    )}
    <div className="space-y-3.5 px-5 py-5">
      <p dir="rtl" lang="ar" className="text-arabic text-right text-foreground">
        {dua.arabic}
      </p>
      <p className="latin-text text-reading font-medium italic text-gold">
        {dua.latin}
      </p>
      <p className="translation-text text-reading text-muted">
        “{dua.translation}”
      </p>
    </div>
    <footer className="dalil-section border-t border-border bg-surface-muted/30 px-5 py-3.5">
      <DalilList items={dua.dalil} />
    </footer>
  </article>
);
