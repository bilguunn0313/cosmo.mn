"use client";

import { MAX_FEATURED_BRANDS } from "@cosmo/shared";
import { Loader2, Plus, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { PanelHeader } from "@/components/admin/panel-header";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrands, useSetFeaturedBrands } from "@/lib/queries/brands";
import { moveItem } from "@/lib/queries/reorder";
import { pickDefaultTranslation } from "@/lib/translations";
import type { Brand } from "@/lib/types";

function brandName(brand: Brand) {
  return pickDefaultTranslation(brand.translations)?.name ?? brand.slug;
}

function savedFeaturedIds(brands: Brand[]) {
  return brands
    .filter((brand) => brand.featuredOrder !== null)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0))
    .map((brand) => brand.id);
}

function BrandThumbnail({ brand }: { brand: Brand }) {
  const image = brand.cover ?? brand.logo;

  return (
    <span className="relative block h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
      {image && (
        <Image
          src={image.url}
          alt=""
          fill
          unoptimized
          sizes="64px"
          className={brand.cover ? "object-cover" : "object-contain p-1"}
        />
      )}
    </span>
  );
}

function FeaturedBrandsForm({ brands }: { brands: Brand[] }) {
  const setFeaturedBrands = useSetFeaturedBrands();
  const savedIds = savedFeaturedIds(brands);
  const [ids, setIds] = useState(savedIds);

  const brandsById = new Map(brands.map((brand) => [brand.id, brand]));
  const selected = ids.flatMap((id) => brandsById.get(id) ?? []);
  const available = brands.filter(
    (brand) => brand.isPublished && !ids.includes(brand.id),
  );
  const isFull = ids.length >= MAX_FEATURED_BRANDS;
  const isDirty = ids.join() !== savedIds.join();

  const save = () => {
    setFeaturedBrands.mutate(ids, {
      onSuccess: () => toast.success("Онцлох брэндүүд хадгалагдлаа"),
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <div className="grid max-w-3xl gap-6">
      {selected.length > 0 ? (
        <ol className="grid gap-2">
          {selected.map((brand, index) => (
            <li
              key={brand.id}
              className="flex items-center gap-3 rounded-xl border bg-card p-2 pr-3"
            >
              <ReorderButtons
                isFirst={index === 0}
                isLast={index === selected.length - 1}
                onMove={(direction) =>
                  setIds(moveItem(ids, index, direction))
                }
              />
              <BrandThumbnail brand={brand} />
              <span className="min-w-0 flex-1 truncate font-medium">
                {brandName(brand)}
              </span>
              {index === 0 && <Badge variant="secondary">Том нүд</Badge>}
              {!brand.isPublished && <Badge variant="outline">Ноорог</Badge>}
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`${brandName(brand)}-г хасах`}
                onClick={() =>
                  setIds((current) => current.filter((id) => id !== brand.id))
                }
              >
                <X />
              </Button>
            </li>
          ))}
        </ol>
      ) : (
        <p className="rounded-xl border border-dashed px-6 py-8 text-center text-sm text-muted-foreground">
          Брэнд сонгоогүй байна. Энэ үед брэндийн ерөнхий дарааллаар эхний{" "}
          {MAX_FEATURED_BRANDS} нь гарна.
        </p>
      )}

      <div className="grid gap-3">
        <p className="text-sm font-medium">
          Брэнд нэмэх{" "}
          <span className="font-normal text-muted-foreground">
            ({ids.length}/{MAX_FEATURED_BRANDS})
          </span>
        </p>
        {available.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {available.map((brand) => (
              <Button
                key={brand.id}
                variant="outline"
                size="sm"
                disabled={isFull}
                onClick={() => setIds((current) => [...current, brand.id])}
              >
                <Plus />
                {brandName(brand)}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Нэмэх нийтлэгдсэн брэнд үлдсэнгүй.
          </p>
        )}
      </div>

      <Button
        type="button"
        className="w-fit"
        onClick={save}
        disabled={!isDirty || setFeaturedBrands.isPending}
      >
        {setFeaturedBrands.isPending && <Loader2 className="animate-spin" />}
        Хадгалах
      </Button>
    </div>
  );
}

interface FeaturedBrandsPanelProps {
  step: number;
}

export function FeaturedBrandsPanel({ step }: FeaturedBrandsPanelProps) {
  const brands = useBrands();

  return (
    <section className="grid gap-4">
      <PanelHeader
        step={step}
        title="Онцлох брэндүүд"
        description={`«Брэндүүд» хэсэгт гарах ${MAX_FEATURED_BRANDS} хүртэл брэнд. 1-рх нь том нүдэнд, 2-рх нь өргөн нүдэнд гарна. Нүүр зурагтай брэнд хамгийн гоё харагдана.`}
      />
      {brands.data ? (
        <FeaturedBrandsForm
          key={savedFeaturedIds(brands.data).join()}
          brands={brands.data}
        />
      ) : (
        <Skeleton className="h-40 max-w-3xl rounded-xl" />
      )}
    </section>
  );
}
