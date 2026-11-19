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
        className={`flex gap-3 rounded-2xl border px-4 py-3.5 text-reading ${
          tip.warning
            ? "border-gold/35 bg-gold-soft/75 text-foreground"
            : "border-border bg-surface text-foreground"
        }`}
      >
        {tip.warning && (
          <AlertIcon className="mt-1 size-5 shrink-0 text-gold" />
        )}
        <div>
          {tip.audience && (
            <span className="audience-prefix mr-2 inline-block rounded-full bg-gold-soft px-2 py-0.5 align-[1px] text-xs font-medium text-gold">
              {audienceLabel[tip.audience]}
            </span>
          )}
          {tip.text}
        </div>
      </li>
    ))}
  </ul>
);
