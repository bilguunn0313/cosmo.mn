"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function FadeInImage({ alt, className, ...props }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Image
      {...props}
      alt={alt}
      onLoad={() => setIsLoaded(true)}
      className={cn(
        "transition-opacity duration-300 ease-out motion-reduce:transition-none",
        !isLoaded && "opacity-0",
        className,
      )}
    />
  );
}
