import type { Step } from "@/content/types";
import { DalilList } from "./dalil";
import { DuaCard } from "./dua-card";
import { BookIcon } from "./icons";
import { TipList } from "./tip-list";

export const StepTitle = ({ step }: { step: Step }) => (
  <div>
    {step.optional && (
      <span className="mb-2 inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent">
        Opsional · sunnah jika memungkinkan
      </span>
    )}
    <h1 className="text-2xl font-extrabold leading-tight">{step.title}</h1>
  </div>
);

export const StepContent = ({
  step,
  showDuas = true,
}: {
  step: Step;
  showDuas?: boolean;
}) => (
  <div className="space-y-6">
    <ol className="space-y-3">
      {step.instructions.map((instruction, index) => (
        <li key={instruction} className="flex gap-3 text-reading">
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary-strong">
            {index + 1}
          </span>
          <span>{instruction}</span>
        </li>
      ))}
    </ol>

    {showDuas && step.duas && step.duas.length > 0 && (
      <div className="space-y-4">
        {step.duas.map((dua) => (
          <DuaCard key={dua.id} dua={dua} />
        ))}
      </div>
    )}

    {step.tips && step.tips.length > 0 && <TipList tips={step.tips} />}

    {step.dalil && step.dalil.length > 0 && (
      <details className="group rounded-2xl border border-border bg-surface">
        <summary className="flex cursor-pointer items-center gap-2 px-4 py-3.5 font-semibold">
          <BookIcon className="size-5 text-primary" />
          Dalil langkah ini
          <span className="ml-auto text-sm text-muted group-open:hidden">
            Lihat
          </span>
        </summary>
        <div className="border-t border-border px-4 py-4">
          <DalilList items={step.dalil} />
        </div>
      </details>
    )}
  </div>
);
