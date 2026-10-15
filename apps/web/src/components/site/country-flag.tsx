import type { CountryCode } from "@cosmo/shared";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CountryFlagProps {
  code: CountryCode;
  className?: string;
}

export function CountryFlag({ code, className }: CountryFlagProps) {
  return (
    <Image
      src={`/flags/${code}.svg`}
      alt=""
      width={30}
      height={20}
      unoptimized
      className={cn(
        "inline-block aspect-3/2 h-[0.9em] w-auto shrink-0 object-cover shadow-[0_0_0_1px_var(--color-rule)]",
        className,
      )}
    />
  );
}
