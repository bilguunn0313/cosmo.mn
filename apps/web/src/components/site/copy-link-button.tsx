"use client";

import { Check, Link2 } from "lucide-react";
import { useEffect, useState } from "react";

const RESET_MS = 2000;

interface CopyLinkButtonProps {
  label: string;
  copiedLabel: string;
}

export function CopyLinkButton({ label, copiedLabel }: CopyLinkButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timer = window.setTimeout(() => setIsCopied(false), RESET_MS);
    return () => window.clearTimeout(timer);
  }, [isCopied]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copyLink}
      className="inline-flex w-fit items-center gap-2 py-1 text-[15px] font-medium text-brand-700 outline-offset-3 outline-brand transition-colors duration-150 hover:text-brand focus-visible:outline-2"
    >
      {isCopied ? (
        <Check className="size-4.5" />
      ) : (
        <Link2 className="size-4.5" />
      )}
      <span aria-live="polite">{isCopied ? copiedLabel : label}</span>
    </button>
  );
}
