import type { Step } from "@/content/types";
import { DalilList } from "./dalil";
import { DuaCard } from "./dua-card";
import { BookIcon } from "./icons";
import { Badge, Card } from "./noor-ui";
import { TipList } from "./tip-list";

export const StepTitle = ({ step }: { step: Step }) => (
  <div className="space-y-2">
    {step.optional && (
      <Badge
        variant="outline"
        className="rounded-full border-warning/40 bg-warning/10 text-xs font-semibold text-warning-foreground"
      >
        Opsional · sunnah jika memungkinkan
      </Badge>
    )}
    <h1 className="text-3xl leading-tight tracking-tight text-foreground">
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
    <ol className="space-y-3">
      {step.instructions.map((instruction, index) => (
        <li key={instruction} className="flex gap-3 text-reading">
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/12 text-sm font-bold text-primary">
            {index + 1}
          </span>
          <span className="text-foreground">{instruction}</span>
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
      <Card className="dalil-section overflow-hidden">
        <details className="group">
          <summary className="flex cursor-pointer items-center gap-2.5 px-4 py-3.5 font-semibold text-card-foreground">
            <BookIcon className="size-5 text-primary" />
            Dalil langkah ini
            <span className="ms-auto text-sm font-medium text-muted-foreground group-open:hidden">
              Lihat
            </span>
          </summary>
          <div className="border-t border-border px-4 py-4">
            <DalilList items={step.dalil} />
          </div>
        </details>
      </Card>
    )}
  </div>
);
