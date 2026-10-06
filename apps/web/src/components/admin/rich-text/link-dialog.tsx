"use client";

import { useState } from "react";
import { FormField } from "@/components/admin/form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { isValidLink } from "@/lib/site-links";

interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialHref: string;
  onSubmit: (href: string) => void;
}

function LinkForm({
  initialHref,
  onSubmit,
  onDone,
}: Omit<LinkDialogProps, "open" | "onOpenChange"> & { onDone: () => void }) {
  const [href, setHref] = useState(initialHref);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = href.trim();

    if (!isValidLink(trimmed)) {
      setError("https://-ээр эхэлсэн бүтэн хаяг оруулна уу");
      return;
    }

    onSubmit(trimmed);
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <FormField label="Хаяг" htmlFor="rich-text-link" error={error}>
        <Input
          id="rich-text-link"
          autoFocus
          value={href}
          placeholder="https://"
          aria-invalid={Boolean(error)}
          onChange={(event) => setHref(event.target.value)}
        />
      </FormField>
      <DialogFooter>
        {initialHref && (
          <Button
            type="button"
            variant="ghost"
            className="mr-auto"
            onClick={() => {
              onSubmit("");
              onDone();
            }}
          >
            Холбоосыг хасах
          </Button>
        )}
        <Button type="button" variant="outline" onClick={onDone}>
          Болих
        </Button>
        <Button type="submit">Хадгалах</Button>
      </DialogFooter>
    </form>
  );
}

export function LinkDialog({
  open,
  onOpenChange,
  initialHref,
  onSubmit,
}: LinkDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Холбоос</DialogTitle>
          <DialogDescription>
            Сонгосон текстийг холбоос болгоно.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <LinkForm
            initialHref={initialHref}
            onSubmit={onSubmit}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
