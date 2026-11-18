"use client";

import { useLinkStatus } from "next/link";
import { SpinnerIcon } from "./icons";

/** Place inside a `relative` <Link>; covers its content with a spinner while navigating. */
export const LinkPending = () => {
  const { pending } = useLinkStatus();

  return (
    <span aria-hidden className={`link-pending ${pending ? "is-pending" : ""}`}>
      <SpinnerIcon className="size-6" />
    </span>
  );
};
