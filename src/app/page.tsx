import Link from "next/link";
import { ContinueCard, SessionStatus } from "@/components/home-progress";
import { SettingsIcon } from "@/components/icons";
import { LinkPending } from "@/components/link-pending";
import { sessions } from "@/content/sessions";

export default function Home() {
  return (
    <main className="pt-safe pb-safe mx-auto max-w-xl px-4">
      <header className="flex items-center justify-between py-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Panduan
          </p>
          <h1 className="text-3xl font-extrabold leading-tight">Umroh</h1>
        </div>
        <Link
          href="/pengaturan/"
          aria-label="Pengaturan"
          className="relative flex size-12 items-center justify-center rounded-full border border-border bg-surface active:bg-surface-muted"
        >
          <SettingsIcon className="size-6" />
          <LinkPending />
        </Link>
      </header>

      <ContinueCard />

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">
          Urutan manasik
        </h2>
        <ol className="space-y-3">
          {sessions.map((session, index) => (
            <li key={session.id}>
              <Link
                href={`/sesi/${session.id}/`}
                className="relative flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 active:bg-surface-muted"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-lg font-extrabold text-primary-strong">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold">{session.title}</p>
                  <p className="text-sm text-muted">{session.subtitle}</p>
                </div>
                <SessionStatus id={session.id} />
                <LinkPending />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-8 rounded-2xl bg-accent-soft px-4 py-3 text-sm leading-relaxed">
        Konten disusun dari Al-Qur&apos;an dan hadits beserta sumbernya, dan
        masih dalam tahap peninjauan. Konsultasikan dengan pembimbing/ustadz
        rombonganmu bila ada keraguan.
      </p>
    </main>
  );
}
