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
  Desktop,
  Gear,
  Lock,
  LockOpen,
  MagnifyingGlass,
  Moon,
  Mosque,
  Palette,
  ShieldWarning,
  SpinnerGap,
  Sun,
  Warning,
  X,
} from "@phosphor-icons/react";
import type { ComponentProps } from "react";

type IconProps = ComponentProps<typeof ArrowLeft>;

export const MarkIcon = (props: IconProps) => <Mosque {...props} />;
export const ArrowLeftIcon = (props: IconProps) => <ArrowLeft {...props} />;
export const ArrowRightIcon = (props: IconProps) => <ArrowRight {...props} />;
export const ChevronRightIcon = (props: IconProps) => <CaretRight {...props} />;
export const ChevronUpIcon = (props: IconProps) => <CaretUp {...props} />;
export const ChevronDownIcon = (props: IconProps) => <CaretDown {...props} />;
export const LockIcon = (props: IconProps) => <Lock {...props} />;
export const UnlockIcon = (props: IconProps) => <LockOpen {...props} />;
export const CheckIcon = (props: IconProps) => <Check {...props} />;
export const CheckCircleIcon = (props: IconProps) => <CheckCircle {...props} />;
export const UndoIcon = (props: IconProps) => (
  <ArrowCounterClockwise {...props} />
);
export const SettingsIcon = (props: IconProps) => <Gear {...props} />;
export const BookIcon = (props: IconProps) => <BookOpenText {...props} />;
export const ExpandIcon = (props: IconProps) => <ArrowsOutSimple {...props} />;
export const ShieldIcon = (props: IconProps) => <ShieldWarning {...props} />;
export const SearchIcon = (props: IconProps) => <MagnifyingGlass {...props} />;
export const CloseIcon = (props: IconProps) => <X {...props} />;
export const PaletteIcon = (props: IconProps) => <Palette {...props} />;
export const SunIcon = (props: IconProps) => <Sun {...props} />;
export const MoonIcon = (props: IconProps) => <Moon {...props} />;
export const DesktopIcon = (props: IconProps) => <Desktop {...props} />;
export const AlertIcon = (props: IconProps) => <Warning {...props} />;

export const SpinnerIcon = ({ className = "", ...props }: IconProps) => (
  <SpinnerGap {...props} className={`animate-spin ${className}`} />
);
