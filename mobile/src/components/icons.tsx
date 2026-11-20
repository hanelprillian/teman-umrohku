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
  Info,
  LockSimple,
  LockSimpleOpen,
  Moon,
  ShieldWarning,
  SlidersHorizontal,
  Sun,
  Warning,
  X,
} from "phosphor-react-native";
import Svg, { Path } from "react-native-svg";
import { colors } from "../theme/colors";

type IconProps = { size?: number; color?: string };

/** Minimal geometric Ka'bah emblem — copied from web icons.tsx. */
export const MarkIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3 4.5 7.2v9.6L12 21l7.5-4.2V7.2L12 3Z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.5 7.2 12 11.4l7.5-4.2"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 11.4V21"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.5 10.6 12 14.8l7.5-4.2"
      stroke={colors.goldBright}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ArrowLeftIcon = (p: IconProps) => <ArrowLeft {...p} />;
export const ArrowRightIcon = (p: IconProps) => <ArrowRight {...p} />;
export const ChevronRightIcon = (p: IconProps) => <CaretRight {...p} />;
export const ChevronUpIcon = (p: IconProps) => <CaretUp {...p} />;
export const ChevronDownIcon = (p: IconProps) => <CaretDown {...p} />;
export const CheckIcon = (p: IconProps) => <Check weight="bold" {...p} />;
export const UndoIcon = (p: IconProps) => <ArrowCounterClockwise {...p} />;
export const SettingsIcon = (p: IconProps) => <SlidersHorizontal {...p} />;
export const BookIcon = (p: IconProps) => <BookOpenText {...p} />;
export const ExpandIcon = (p: IconProps) => <ArrowsOutSimple {...p} />;
export const LockIcon = (p: IconProps) => <LockSimple {...p} />;
export const UnlockIcon = (p: IconProps) => <LockSimpleOpen {...p} />;
export const SunIcon = (p: IconProps) => <Sun {...p} />;
export const MoonIcon = (p: IconProps) => <Moon {...p} />;
export const InfoIcon = (p: IconProps) => <Info {...p} />;
export const AlertIcon = (p: IconProps) => <Warning {...p} />;
export const ShieldIcon = (p: IconProps) => <ShieldWarning {...p} />;
export const CloseIcon = (p: IconProps) => <X {...p} />;
