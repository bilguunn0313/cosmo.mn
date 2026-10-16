"use client";

import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  labels: { share: string; copy: string; copied: string };
}

const buttonClass =
  "inline-flex h-11 items-center justify-center border-2 border-rule px-4 text-sm font-medium transition-colors duration-200 hover:bg-brand-100";

export function ShareButtons({ url, labels }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="grid gap-3 border-t-2 border-rule pt-3">
      <span className="eyebrow text-ink-3">{labels.share}</span>
      <div className="flex flex-wrap gap-0.5">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener"
          className={buttonClass}
        >
          Facebook
        </a>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            } catch {}
          }}
          className={`${buttonClass} min-w-32`}
          aria-live="polite"
        >
          {copied ? labels.copied : labels.copy}
        </button>
      </div>
    </div>
  );
}
