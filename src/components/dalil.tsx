import type { Dalil, DalilStatus } from "@/content/types";
import { Badge } from "./noor-ui";

const statusStyles: Record<
  DalilStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    className?: string;
  }
> = {
  quran: { label: "Al-Qur'an", variant: "default" },
  shahih: {
    label: "Shahih",
    variant: "outline",
    className: "border-success/40 bg-success/10 text-success-foreground",
  },
  hasan: {
    label: "Hasan",
    variant: "outline",
    className: "border-info/40 bg-info/10 text-info-foreground",
  },
  atsar: {
    label: "Atsar Sahabat",
    variant: "outline",
    className: "border-warning/40 bg-warning/10 text-warning-foreground",
  },
  ijma: {
    label: "Ijma' Ulama",
    variant: "outline",
    className: "border-primary/35 bg-primary/10 text-primary",
  },
  diperselisihkan: {
    label: "Diperselisihkan",
    variant: "destructive",
  },
};

export const StatusBadge = ({ status }: { status: DalilStatus }) => {
  const { label, variant, className } = statusStyles[status];
  return (
    <Badge
      variant={variant}
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${className ?? ""}`}
    >
      {label}
    </Badge>
  );
};

const DalilItem = ({ dalil }: { dalil: Dalil }) => {
  const hasDetail = Boolean(dalil.quote || dalil.note);
  const header = (
    <div className="flex items-start justify-between gap-3">
      <span className="text-sm font-medium text-muted-foreground">
        {dalil.source}
      </span>
      <StatusBadge status={dalil.status} />
    </div>
  );

  if (!hasDetail) return <li>{header}</li>;

  return (
    <li>
      <details className="group">
        <summary className="cursor-pointer">
          {header}
          <span className="mt-1 inline-block text-xs font-semibold text-primary group-open:hidden">
            Lihat keterangan
          </span>
        </summary>
        <div className="mt-2 space-y-2 border-s-2 border-primary/40 ps-3 text-sm leading-relaxed">
          {dalil.quote && <p className="italic">“{dalil.quote}”</p>}
          {dalil.note && <p className="text-muted-foreground">{dalil.note}</p>}
        </div>
      </details>
    </li>
  );
};

export const DalilList = ({ items }: { items: Dalil[] }) => (
  <ul className="space-y-3">
    {items.map((dalil, index) => (
      <DalilItem key={`${dalil.source}-${index}`} dalil={dalil} />
    ))}
  </ul>
);
