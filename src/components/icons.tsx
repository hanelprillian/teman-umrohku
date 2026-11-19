import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/** Two figures, one a step beside the other. The mark for Teman Umrohku. */
export const MarkIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="8" cy="6.5" r="2" />
    <path d="M8 9.5v6" />
    <circle cx="15.5" cy="8" r="2" />
    <path d="M15.5 11v5.5" />
  </svg>
);

export const ArrowLeftIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

export const ArrowRightIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export const ChevronUpIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m18 15-6-6-6 6" />
  </svg>
);

export const ChevronDownIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const LockIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

export const UnlockIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 7.75-1.4" />
  </svg>
);

export const CheckIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const UndoIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
  </svg>
);

export const SettingsIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.66 0-1.25.4-1.51 1Z" />
  </svg>
);

export const BookIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Z" />
    <path d="M6.5 17A2.5 2.5 0 0 0 4 19.5 2.5 2.5 0 0 0 6.5 22H20v-5" />
  </svg>
);

export const ExpandIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </svg>
);

export const ShieldIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m4.9 4.9 14.2 14.2" />
  </svg>
);

export const SearchIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const CloseIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const SpinnerIcon = ({ className = "", ...props }: IconProps) => (
  <svg {...base} {...props} className={`animate-spin ${className}`}>
    <path d="M21 12a9 9 0 1 1-6.22-8.56" />
  </svg>
);

export const AlertIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
);
