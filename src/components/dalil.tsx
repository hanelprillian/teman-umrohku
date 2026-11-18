import type { Dalil, DalilStatus } from "@/content/types";

const statusStyles: Record<DalilStatus, { label: string; className: string }> = {
  quran: { label: "Al-Qur'an", className: "bg-primary text-primary-foreground" },
  shahih: { label: "Shahih", className: "bg-primary-soft text-primary-strong" },
  hasan: { label: "Hasan", className: "bg-primary-soft text-primary-strong" },
  atsar: { label: "Atsar Sahabat", className: "bg-accent-soft text-accent" },
  diperselisihkan: {
    label: "Diperselisihkan",
    className: "bg-danger-soft text-danger",
  },
};

export const StatusBadge = ({ status }: { status: DalilStatus }) => {
  const { label, className } = statusStyles[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  );
};

const DalilItem = ({ dalil }: { dalil: Dalil }) => {
  const hasDetail = Boolean(dalil.quote || dalil.note);
  const header = (
    <div className="flex items-start justify-between gap-3">
      <span className="text-sm font-medium text-muted">{dalil.source}</span>
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
        <div className="mt-2 space-y-2 border-l-2 border-primary/40 pl-3 text-sm leading-relaxed">
          {dalil.quote && <p className="italic">“{dalil.quote}”</p>}
          {dalil.note && <p className="text-muted">{dalil.note}</p>}
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
