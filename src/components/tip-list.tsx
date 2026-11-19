import type { Audience, Tip } from "@/content/types";
import { Badge, Callout } from "./noor-ui";

const audienceLabel: Record<Audience, string> = {
  pria: "Pria",
  wanita: "Wanita",
};

export const TipList = ({ tips }: { tips: Tip[] }) => (
  <ul className="space-y-3">
    {tips.map((tip) => (
      <li key={tip.text} data-audience={tip.audience}>
        <Callout
          type={tip.warning ? "warning" : "note"}
          className="my-0 text-reading"
        >
          {tip.audience && (
            <Badge
              variant="outline"
              className="audience-prefix me-2 align-[2px] border-primary/30 bg-primary/10 text-xs text-primary"
            >
              {audienceLabel[tip.audience]}
            </Badge>
          )}
          {tip.text}
        </Callout>
      </li>
    ))}
  </ul>
);
