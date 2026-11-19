import Link from "next/link";
import { ContinueCard, SessionStatus } from "@/components/home-progress";
import {
  BookIcon,
  ChevronRightIcon,
  MarkIcon,
  SettingsIcon,
} from "@/components/icons";
import { IhramRulesButton } from "@/components/ihram-rules";
import { LinkPending } from "@/components/link-pending";
import { Callout, Card, Separator } from "@/components/noor-ui";
import { Onboarding } from "@/components/onboarding";
import { ThemeQuickSwitcher } from "@/components/theme-quick-switcher";
import { sessions } from "@/content/sessions";

export default function Home() {
  return (
    <main className="pt-safe pb-safe mx-auto max-w-xl px-5 pb-10">
      <header className="flex items-center justify-between gap-3 py-6">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary/12 text-primary ring-1 ring-primary/20">
            <MarkIcon className="size-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold leading-none text-foreground">
              Teman Umrohku
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Langkah demi langkah, di saku.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeQuickSwitcher />
          <Link
            href="/pengaturan/"
            aria-label="Pengaturan"
            className="relative flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-xs transition-colors hover:bg-muted hover:text-foreground active:bg-muted"
          >
            <SettingsIcon className="size-5" />
            <LinkPending />
          </Link>
        </div>
      </header>

      <ContinueCard />

      <section className="mt-8">
        <h2 className="mb-2.5 px-1 text-sm font-semibold text-muted-foreground">
          Urutan manasik
        </h2>
        <Card className="overflow-hidden border-border bg-card shadow-sm">
          <ol className="divide-y divide-border">
            {sessions.map((session, index) => (
              <li key={session.id}>
                <Link
                  href={`/sesi/${session.id}/`}
                  className="relative flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-muted/50 active:bg-muted"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary/10 text-sm font-bold text-primary">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-card-foreground">
                      {session.title}
                    </span>
                    <span className="block text-sm text-muted-foreground">
                      {session.subtitle}
                    </span>
                  </span>
                  <SessionStatus id={session.id} />
                  <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
                  <LinkPending />
                </Link>
              </li>
            ))}
          </ol>
        </Card>
      </section>

      <section className="mt-8">
        <h2 className="mb-2.5 px-1 text-sm font-semibold text-muted-foreground">
          Rujukan cepat
        </h2>
        <Card className="overflow-hidden border-border bg-card shadow-sm">
          <Link
            href="/doa/"
            className="relative flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-muted/50 active:bg-muted"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary/10 text-primary">
              <BookIcon className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-card-foreground">
                Kumpulan doa
              </span>
              <span className="block text-sm text-muted-foreground">
                Semua bacaan, lengkap dengan pencarian
              </span>
            </span>
            <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
            <LinkPending />
          </Link>
          <Separator />
          <IhramRulesButton variant="row" />
        </Card>
      </section>

      <div className="mt-8">
        <Callout type="note" className="my-0 text-sm">
          Disusun dari Al-Qur&apos;an dan hadits beserta sumbernya, masih dalam
          peninjauan. Kalau ragu, tanya pembimbing rombonganmu.
        </Callout>
      </div>

      <Onboarding />
    </main>
  );
}
