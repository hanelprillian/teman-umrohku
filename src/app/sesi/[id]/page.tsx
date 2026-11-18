import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SessionRunner } from "@/components/session-runner";
import { getNextSession, getSession, sessions } from "@/content/sessions";

export const dynamicParams = false;

export const generateStaticParams = () =>
  sessions.map((session) => ({ id: session.id }));

export const generateMetadata = async ({
  params,
}: PageProps<"/sesi/[id]">): Promise<Metadata> => {
  const { id } = await params;
  return { title: `${getSession(id)?.title ?? "Sesi"} · Panduan Umroh` };
};

export default async function SessionPage({ params }: PageProps<"/sesi/[id]">) {
  const { id } = await params;
  const session = getSession(id);
  if (!session) notFound();

  const next = getNextSession(session.id);

  return (
    <SessionRunner
      session={session}
      nextSession={next && { id: next.id, title: next.title }}
    />
  );
}
