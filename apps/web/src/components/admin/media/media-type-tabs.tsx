"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MediaType } from "@/lib/types";

const ALL = "ALL";

interface MediaTypeTabsProps {
  value: MediaType | undefined;
  onChange: (value: MediaType | undefined) => void;
}

export function MediaTypeTabs({ value, onChange }: MediaTypeTabsProps) {
  return (
    <Tabs
      value={value ?? ALL}
      onValueChange={(next) =>
        onChange(next === ALL ? undefined : (next as MediaType))
      }
    >
      <TabsList>
        <TabsTrigger value={ALL}>Бүгд</TabsTrigger>
        <TabsTrigger value="IMAGE">Зураг</TabsTrigger>
        <TabsTrigger value="VIDEO">Видео</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
