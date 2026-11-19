"use client";

import { useDeferredValue, useState } from "react";
import { sessions } from "@/content/sessions";
import type { Dua, Session } from "@/content/types";
import { DuaCard } from "./dua-card";
import { CloseIcon, SearchIcon } from "./icons";
import { EmptyState, Input } from "./noor-ui";

interface DuaEntry {
  dua: Dua;
  stepTitles: string[];
  searchText: string;
}

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['‘’ʿʾ`-]/g, "")
    .toLowerCase();

const groups: { session: Session; entries: DuaEntry[] }[] = sessions.map(
  (session) => {
    const entries = new Map<string, DuaEntry>();
    for (const step of session.steps) {
      for (const dua of step.duas ?? []) {
        const entry = entries.get(dua.id);
        if (entry) {
          entry.stepTitles.push(step.title);
          continue;
        }
        entries.set(dua.id, {
          dua,
          stepTitles: [step.title],
          searchText: normalize(
            [session.title, step.title, dua.title, dua.latin, dua.translation].join(
              " ",
            ),
          ),
        });
      }
    }
    return { session, entries: [...entries.values()] };
  },
);

export const DuaCollection = () => {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const terms = normalize(deferredQuery).split(/\s+/).filter(Boolean);

  const results = groups
    .map((group) => ({
      ...group,
      entries: group.entries.filter((entry) =>
        terms.every((term) => entry.searchText.includes(term)),
      ),
    }))
    .filter((group) => group.entries.length > 0);

  return (
    <div className="space-y-8">
      <div className="sticky top-0 z-10 -mx-4 bg-background/95 px-4 py-3 backdrop-blur">
        <label className="relative block">
          <span className="sr-only">Cari doa</span>
          <SearchIcon className="pointer-events-none absolute start-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari: talbiyah, zamzam, shafa…"
            className="h-12 bg-card pe-11 ps-11 text-base [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Hapus pencarian"
              className="absolute end-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            >
              <CloseIcon className="size-4" />
            </button>
          )}
        </label>
      </div>

      {results.length === 0 && (
        <EmptyState
          title="Doa tidak ditemukan"
          description={`Tidak ada bacaan yang cocok dengan “${deferredQuery}”.`}
        />
      )}

      {results.map(({ session, entries }) => (
        <section key={session.id}>
          <h2 className="mb-3 text-xl font-bold text-foreground">
            {session.title}
          </h2>
          <div className="space-y-5">
            {entries.map(({ dua, stepTitles }) => (
              <div key={dua.id}>
                <p className="mb-1.5 px-1 text-sm text-muted-foreground">
                  {stepTitles.join(" · ")}
                </p>
                <DuaCard dua={dua} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
