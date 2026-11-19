"use client";

import {
  CheckCircle,
  Info,
  Warning,
  WarningCircle,
} from "@phosphor-icons/react";
import type {
  ButtonHTMLAttributes,
  ComponentType,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";

const cx = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

/* ─── Button (Noor UI) ─────────────────────────────────────────────────────── */

type ButtonVariant =
  | "primary"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";
type ButtonSize = "sm" | "md" | "lg" | "xl" | "icon";

const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow hover:bg-primary/90 active:bg-primary/85",
  secondary:
    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  destructive:
    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  outline:
    "border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

const buttonSizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 rounded-md px-3 text-xs",
  md: "h-9 rounded-md px-4 py-2 text-sm",
  lg: "h-10 rounded-md px-6 text-sm",
  xl: "h-12 rounded-lg px-6 text-base",
  icon: "h-9 w-9 rounded-md",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = ({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) => (
  <button
    className={cx(
      "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      buttonVariantClasses[variant],
      buttonSizeClasses[size],
      className,
    )}
    {...props}
  />
);

/* ─── Card (Noor UI) ───────────────────────────────────────────────────────── */

export const Card = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cx(
      "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
      className,
    )}
    {...props}
  />
);

export const CardHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx("flex flex-col gap-1.5 p-6", className)} {...props} />
);

export const CardTitle = ({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cx("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
);

export const CardDescription = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cx("text-sm text-muted-foreground", className)} {...props} />
);

export const CardContent = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx("p-6 pt-0", className)} {...props} />
);

export const CardFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx("flex items-center p-6 pt-0", className)} {...props} />
);

/* ─── Badge (Noor UI) ──────────────────────────────────────────────────────── */

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const badgeVariantClasses: Record<BadgeVariant, string> = {
  default:
    "border-transparent bg-primary text-primary-foreground shadow-xs hover:bg-primary/85",
  secondary:
    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/85",
  destructive:
    "border-transparent bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/85",
  outline: "border-border text-foreground",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = ({
  className,
  variant = "default",
  ...props
}: BadgeProps) => (
  <span
    className={cx(
      "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors",
      badgeVariantClasses[variant],
      className,
    )}
    {...props}
  />
);

/* ─── Callout (Noor UI) ────────────────────────────────────────────────────── */

export type CalloutType = "info" | "warning" | "error" | "success" | "note";

const calloutConfig: Record<
  CalloutType,
  {
    icon: ComponentType<{ className?: string }>;
    borderColor: string;
    bgColor: string;
    iconColor: string;
    titleColor: string;
  }
> = {
  info: {
    icon: Info,
    borderColor: "border-info/50",
    bgColor: "bg-info/10",
    iconColor: "text-info",
    titleColor: "text-info-foreground",
  },
  warning: {
    icon: Warning,
    borderColor: "border-warning/60",
    bgColor: "bg-warning/10",
    iconColor: "text-warning",
    titleColor: "text-warning-foreground",
  },
  error: {
    icon: WarningCircle,
    borderColor: "border-destructive/50",
    bgColor: "bg-destructive/10",
    iconColor: "text-destructive",
    titleColor: "text-destructive",
  },
  success: {
    icon: CheckCircle,
    borderColor: "border-success/50",
    bgColor: "bg-success/10",
    iconColor: "text-success",
    titleColor: "text-success-foreground",
  },
  note: {
    icon: Info,
    borderColor: "border-primary/50",
    bgColor: "bg-primary/8",
    iconColor: "text-primary",
    titleColor: "text-primary",
  },
};

export const Callout = ({
  children,
  type = "info",
  title,
  className,
}: {
  children: ReactNode;
  type?: CalloutType;
  title?: string;
  className?: string;
}) => {
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <div
      role="note"
      className={cx(
        "my-6 rounded-lg border-s-4 p-4",
        config.borderColor,
        config.bgColor,
        className,
      )}
    >
      <div className="flex gap-3">
        <Icon className={cx("mt-0.5 size-5 shrink-0", config.iconColor)} />
        <div className="min-w-0 flex-1">
          {title && (
            <p className={cx("mb-1 font-semibold", config.titleColor)}>
              {title}
            </p>
          )}
          <div className="text-foreground/90">{children}</div>
        </div>
      </div>
    </div>
  );
};

/* ─── Input (Noor UI) ──────────────────────────────────────────────────────── */

export const Input = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cx(
      "flex h-10 w-full rounded-md border border-input bg-card px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
);

/* ─── Switch (Noor UI) ─────────────────────────────────────────────────────── */

export const Switch = ({
  checked,
  onCheckedChange,
  className,
  "aria-label": ariaLabel,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  "aria-label"?: string;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={ariaLabel}
    onClick={() => onCheckedChange(!checked)}
    className={cx(
      "peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      checked ? "bg-primary" : "bg-input",
      className,
    )}
  >
    <span
      className={cx(
        "pointer-events-none block size-6 rounded-full bg-background shadow-md ring-0 transition-transform",
        checked ? "translate-x-5" : "translate-x-0",
      )}
    />
  </button>
);

/* ─── Progress (Noor UI) ───────────────────────────────────────────────────── */

export const Progress = ({
  value = 0,
  className,
}: {
  value?: number;
  className?: string;
}) => {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className={cx(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/15",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};

/* ─── Separator (Noor UI) ──────────────────────────────────────────────────── */

export const Separator = ({ className }: { className?: string }) => (
  <div role="separator" className={cx("h-px w-full shrink-0 bg-border", className)} />
);

/* ─── EmptyState (Noor UI) ─────────────────────────────────────────────────── */

export const EmptyState = ({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) => (
  <div
    role="status"
    aria-live="polite"
    className={cx(
      "flex flex-col items-center justify-center px-4 py-12 text-center",
      className,
    )}
  >
    <h3 className="mb-1.5 text-lg font-semibold text-foreground">{title}</h3>
    {description && (
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    )}
  </div>
);
