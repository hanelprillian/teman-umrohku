import Link from "next/link";
import {
  ContinueCard,
  SessionMarker,
  SessionStatus,
} from "@/components/home-progress";
import {
  BookIcon,
  ChevronRightIcon,
  InfoIcon,
  MarkIcon,
  SettingsIcon,
} from "@/components/icons";
import { IhramRulesButton } from "@/components/ihram-rules";
import { LinkPending } from "@/components/link-pending";
import { Onboarding } from "@/components/onboarding";
import { ThemeToggle } from "@/components/theme-toggle";
import { sessions } from "@/content/sessions";

export default function Home() {
  return (
    <main className="pt-safe pb-safe mx-auto max-w-xl px-5 pb-12">
      <header className="flex items-center justify-between gap-3 py-6">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-kiswah text-kiswah-fg ring-1 ring-gold/30">
            <MarkIcon className="size-6" />
          </span>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Teman Umrohku
            </h1>
            <p className="text-xs text-muted">Panduan manasik di saku</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/pengaturan/"
            aria-label="Pengaturan"
            className="relative flex size-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:text-foreground active:bg-surface-muted"
          >
            <SettingsIcon className="size-5" />
            <LinkPending />
          </Link>
        </div>
      </header>

      <ContinueCard />

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-foreground">
            Urutan manasik
          </h2>
          <span className="text-xs text-muted">{sessions.length} tahapan</span>
        </div>
        <ol className="nusuk-card divide-y divide-border overflow-hidden rounded-[22px]">
          {sessions.map((session, index) => (
            <li key={session.id}>
              <Link
                href={`/sesi/${session.id}/`}
                className="relative flex items-center gap-3.5 px-4 py-4 transition-colors hover:bg-surface-muted/50 active:bg-surface-muted"
              >
                <SessionMarker id={session.id} index={index} />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-foreground">
                    {session.title}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">
                    {session.subtitle}
                  </span>
                </span>
                <SessionStatus id={session.id} />
                <ChevronRightIcon className="size-4 shrink-0 text-muted/70" />
                <LinkPending />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 px-1 text-sm font-semibold text-foreground">
          Rujukan cepat
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/doa/"
            className="nusuk-card relative flex flex-col justify-between gap-4 rounded-[20px] p-4 transition-colors hover:border-gold/40 active:bg-surface-muted"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-gold-soft text-gold">
              <BookIcon className="size-5" />
            </span>
            <div>
              <span className="block font-semibold text-foreground">
                Kumpulan doa
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                Semua bacaan &amp; pencarian
              </span>
            </div>
            <LinkPending />
          </Link>
          <IhramRulesButton variant="tile" />
        </div>
      </section>

      <div className="mt-8 flex items-start gap-2.5 rounded-2xl border border-border bg-surface/60 px-4 py-3.5 text-xs leading-relaxed text-muted">
        <InfoIcon className="mt-0.5 size-4 shrink-0 text-gold" />
        <p>
          Disusun dari Al-Qur&apos;an dan hadits beserta sumbernya, masih dalam
          peninjauan. Bila ragu, tanyakan kepada pembimbing rombonganmu.
        </p>
      </div>

      <Onboarding />
    </main>
  );
}
