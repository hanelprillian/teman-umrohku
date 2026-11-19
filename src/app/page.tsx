import Link from "next/link";
import { ContinueCard, SessionStatus } from "@/components/home-progress";
import { MarkIcon, SettingsIcon } from "@/components/icons";
import { IhramRulesButton } from "@/components/ihram-rules";
import { LinkPending } from "@/components/link-pending";
import { Onboarding } from "@/components/onboarding";
import { sessions } from "@/content/sessions";

export default function Home() {
  return (
    <main className="pt-safe pb-safe mx-auto max-w-xl px-5">
      <header className="flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full border border-border text-primary">
            <MarkIcon className="size-6" />
          </span>
          <div>
            <h1 className="font-display text-[1.7rem] leading-none">Teman Umrohku</h1>
            <p className="mt-1 text-sm text-muted">Langkah demi langkah, di saku.</p>
          </div>
        </div>
        <Link
          href="/pengaturan/"
          aria-label="Pengaturan"
          className="relative flex size-11 items-center justify-center rounded-full text-muted active:bg-surface-muted"
        >
          <SettingsIcon className="size-6" />
          <LinkPending />
        </Link>
      </header>

      <ContinueCard />

      <section className="mt-9">
        <h2 className="mb-2 px-1 text-sm font-medium text-muted">Manasik</h2>
        <ol className="overflow-hidden rounded-2xl border border-border bg-surface">
          {sessions.map((session, index) => (
            <li key={session.id} className="border-t border-border first:border-t-0">
              <Link
                href={`/sesi/${session.id}/`}
                className="relative flex items-center gap-3 px-4 py-3.5 active:bg-surface-muted"
              >
                <span className="w-5 font-display text-lg text-primary">{index + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{session.title}</span>
                  <span className="block text-sm text-muted">{session.subtitle}</span>
                </span>
                <SessionStatus id={session.id} />
                <LinkPending />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="mb-2 px-1 text-sm font-medium text-muted">Rujukan</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <Link
            href="/doa/"
            className="relative flex items-center gap-3 px-4 py-3.5 active:bg-surface-muted"
          >
            <span className="min-w-0 flex-1">
              <span className="block font-medium">Kumpulan doa</span>
              <span className="block text-sm text-muted">Semua bacaan, bisa dicari</span>
            </span>
            <LinkPending />
          </Link>
          <IhramRulesButton variant="row" />
        </div>
      </section>

      <p className="mt-8 px-1 text-sm leading-relaxed text-muted">
        Disusun dari Al-Qur&apos;an dan hadits beserta sumbernya, masih dalam
        peninjauan. Kalau ragu, tanya pembimbing rombonganmu.
      </p>

      <Onboarding />
    </main>
  );
}
