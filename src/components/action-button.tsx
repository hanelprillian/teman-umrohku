"use client";

import { type ButtonHTMLAttributes, type MouseEvent, useEffect, useRef, useState } from "react";
import { SpinnerIcon } from "./icons";

/** Long enough to swallow an accidental double tap. */
const BUSY_MS = 600;

interface ActionButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type"> {
  onAction: () => void;
}

export const ActionButton = ({
  onAction,
  children,
  disabled,
  style,
  ...props
}: ActionButtonProps) => {
  const [busyWidth, setBusyWidth] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (busyWidth !== null) return;
    setBusyWidth(event.currentTarget.offsetWidth);
    timers.current.push(
      setTimeout(onAction, 50),
      setTimeout(() => setBusyWidth(null), BUSY_MS),
    );
  };

  const busy = busyWidth !== null;

  return (
    <button
      {...props}
      type="button"
      onClick={handleClick}
      disabled={disabled || busy}
      aria-busy={busy}
      style={busy ? { ...style, width: busyWidth } : style}
    >
      {busy ? (
        <>
          <SpinnerIcon className="size-6" />
          <span className="sr-only">Memuat</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
