import type { Step } from "@/content/types";
import { DalilList } from "./dalil";
import { DuaCard } from "./dua-card";
import { BookIcon } from "./icons";
import { TipList } from "./tip-list";

export const StepTitle = ({ step }: { step: Step }) => (
  <div>
    {step.optional && (
      <span className="mb-2 inline-block rounded-full bg-gold-soft px-3 py-0.5 text-xs font-medium text-gold">
        Opsional · sunnah jika memungkinkan
      </span>
    )}
    <h1 className="text-[1.7rem] font-semibold leading-tight tracking-tight text-foreground">
      {step.title}
    </h1>
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
    <ol className="space-y-3.5">
      {step.instructions.map((instruction, index) => (
        <li key={instruction} className="flex gap-3 text-reading">
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-gold-soft text-xs font-semibold tabular-nums text-gold">
            {index + 1}
          </span>
          <span>{instruction}</span>
        </li>
      ))}
    </ol>

    {showDuas && step.duas && step.duas.length > 0 && (
      <div className="space-y-4">
        {step.duas.map((dua, index) => (
          <div key={dua.id} {...(index === 0 ? { "data-first-dua": "" } : {})}>
            <DuaCard dua={dua} />
          </div>
        ))}
      </div>
    )}

    {step.tips && step.tips.length > 0 && <TipList tips={step.tips} />}

    {step.dalil && step.dalil.length > 0 && (
      <details className="dalil-section nusuk-card group rounded-[20px]">
        <summary className="flex cursor-pointer items-center gap-2.5 px-4 py-3.5 font-medium text-foreground">
          <BookIcon className="size-5 text-gold" />
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
