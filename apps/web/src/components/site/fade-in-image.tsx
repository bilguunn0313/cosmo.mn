"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function FadeInImage({ alt, className, onLoad, ...props }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Image
      {...props}
      alt={alt}
      onLoad={(event) => {
        setIsLoaded(true);
        onLoad?.(event);
      }}
      className={cn(
        "transition-opacity duration-300 ease-out motion-reduce:transition-none",
        !isLoaded && !props.priority && "fade-in-pending opacity-0",
        className,
      )}
    />
  );
}
