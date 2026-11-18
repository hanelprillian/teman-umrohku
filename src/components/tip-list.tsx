import type { Audience, Tip } from "@/content/types";
import { AlertIcon } from "./icons";

const audienceLabel: Record<Audience, string> = {
  pria: "Pria",
  wanita: "Wanita",
};

export const TipList = ({ tips }: { tips: Tip[] }) => (
  <ul className="space-y-2.5">
    {tips.map((tip) => (
      <li
        key={tip.text}
        data-audience={tip.audience}
        className={`flex gap-3 rounded-xl px-4 py-3 text-reading ${
          tip.warning
            ? "bg-accent-soft text-foreground"
            : "bg-surface-muted text-foreground"
        }`}
      >
        {tip.warning && (
          <AlertIcon className="mt-1 size-5 shrink-0 text-accent" />
        )}
        <div>
          {tip.audience && (
            <span className="audience-prefix mr-2 inline-block rounded-md bg-primary px-1.5 py-0.5 align-[2px] text-xs font-bold uppercase tracking-wide text-primary-foreground">
              {audienceLabel[tip.audience]}
            </span>
          )}
          {tip.text}
        </div>
      </li>
    ))}
  </ul>
);
