"use client";

import {
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  ArrowsOutSimple,
  BookOpenText,
  CaretDown,
  CaretRight,
  CaretUp,
  Check,
  CheckCircle,
  Info,
  LockSimple,
  LockSimpleOpen,
  MagnifyingGlass,
  Moon,
  ShieldWarning,
  SlidersHorizontal,
  SpinnerGap,
  Sun,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import type { ComponentProps, SVGProps } from "react";

type IconProps = ComponentProps<typeof ArrowLeft>;

/** Minimal geometric Ka'bah emblem with gold Kiswah band — Nusuk-inspired. */
export const MarkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <path d="M12 3 4.5 7.2v9.6L12 21l7.5-4.2V7.2L12 3Z" />
    <path d="M4.5 7.2 12 11.4l7.5-4.2" />
    <path d="M12 11.4V21" />
    <path
      d="M4.5 10.6 12 14.8l7.5-4.2"
      stroke="var(--gold-bright)"
      strokeWidth={1.8}
    />
  </svg>
);

export const ArrowLeftIcon = (props: IconProps) => (
  <ArrowLeft weight="regular" {...props} />
);
export const ArrowRightIcon = (props: IconProps) => (
  <ArrowRight weight="regular" {...props} />
);
export const ChevronRightIcon = (props: IconProps) => (
  <CaretRight weight="regular" {...props} />
);
export const ChevronUpIcon = (props: IconProps) => (
  <CaretUp weight="regular" {...props} />
);
export const ChevronDownIcon = (props: IconProps) => (
  <CaretDown weight="regular" {...props} />
);
export const LockIcon = (props: IconProps) => (
  <LockSimple weight="regular" {...props} />
);
export const UnlockIcon = (props: IconProps) => (
  <LockSimpleOpen weight="regular" {...props} />
);
export const CheckIcon = (props: IconProps) => (
  <Check weight="bold" {...props} />
);
export const CheckCircleIcon = (props: IconProps) => (
  <CheckCircle weight="fill" {...props} />
);
export const UndoIcon = (props: IconProps) => (
  <ArrowCounterClockwise weight="regular" {...props} />
);
export const SettingsIcon = (props: IconProps) => (
  <SlidersHorizontal weight="regular" {...props} />
);
export const BookIcon = (props: IconProps) => (
  <BookOpenText weight="regular" {...props} />
);
export const ExpandIcon = (props: IconProps) => (
  <ArrowsOutSimple weight="regular" {...props} />
);
export const ShieldIcon = (props: IconProps) => (
  <ShieldWarning weight="regular" {...props} />
);
export const SearchIcon = (props: IconProps) => (
  <MagnifyingGlass weight="regular" {...props} />
);
export const CloseIcon = (props: IconProps) => (
  <X weight="regular" {...props} />
);
export const SunIcon = (props: IconProps) => (
  <Sun weight="regular" {...props} />
);
export const MoonIcon = (props: IconProps) => (
  <Moon weight="regular" {...props} />
);
export const InfoIcon = (props: IconProps) => (
  <Info weight="regular" {...props} />
);
export const AlertIcon = (props: IconProps) => (
  <WarningCircle weight="regular" {...props} />
);

export const SpinnerIcon = ({ className = "", ...props }: IconProps) => (
  <SpinnerGap weight="regular" {...props} className={`animate-spin ${className}`} />
);
