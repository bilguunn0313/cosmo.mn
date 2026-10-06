"use client";

import { useEditorState, type Editor } from "@tiptap/react";
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Underline,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { MediaPicker } from "@/components/admin/media/media-picker";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { LinkDialog } from "./link-dialog";

interface ToolbarButtonProps {
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

function ToolbarButton({
  label,
  icon: Icon,
  isActive = false,
  disabled = false,
  onClick,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            aria-pressed={isActive}
            disabled={disabled}
            onClick={onClick}
            className={cn(isActive && "bg-muted text-foreground")}
          />
        }
      >
        <Icon />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function RichTextToolbar({ editor }: { editor: Editor }) {
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      isBold: current.isActive("bold"),
      isItalic: current.isActive("italic"),
      isUnderline: current.isActive("underline"),
      isHeading2: current.isActive("heading", { level: 2 }),
      isHeading3: current.isActive("heading", { level: 3 }),
      isBulletList: current.isActive("bulletList"),
      isOrderedList: current.isActive("orderedList"),
      isQuote: current.isActive("blockquote"),
      isLink: current.isActive("link"),
      currentLink:
        (current.getAttributes("link").href as string | undefined) ?? "",
      canUndo: current.can().undo(),
      canRedo: current.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();

  const applyLink = (href: string) => {
    if (href === "") {
      chain().extendMarkRange("link").unsetLink().run();
      return;
    }

    chain().extendMarkRange("link").setLink({ href }).run();
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 px-1.5 py-1">
        <ToolbarButton
          label="Том гарчиг"
          icon={Heading2}
          isActive={state.isHeading2}
          onClick={() => chain().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          label="Жижиг гарчиг"
          icon={Heading3}
          isActive={state.isHeading3}
          onClick={() => chain().toggleHeading({ level: 3 }).run()}
        />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <ToolbarButton
          label="Тод"
          icon={Bold}
          isActive={state.isBold}
          onClick={() => chain().toggleBold().run()}
        />
        <ToolbarButton
          label="Налуу"
          icon={Italic}
          isActive={state.isItalic}
          onClick={() => chain().toggleItalic().run()}
        />
        <ToolbarButton
          label="Доогуур зураас"
          icon={Underline}
          isActive={state.isUnderline}
          onClick={() => chain().toggleUnderline().run()}
        />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <ToolbarButton
          label="Жагсаалт"
          icon={List}
          isActive={state.isBulletList}
          onClick={() => chain().toggleBulletList().run()}
        />
        <ToolbarButton
          label="Дугаарласан жагсаалт"
          icon={ListOrdered}
          isActive={state.isOrderedList}
          onClick={() => chain().toggleOrderedList().run()}
        />
        <ToolbarButton
          label="Ишлэл"
          icon={Quote}
          isActive={state.isQuote}
          onClick={() => chain().toggleBlockquote().run()}
        />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <ToolbarButton
          label="Холбоос"
          icon={Link2}
          isActive={state.isLink}
          onClick={() => setIsLinkDialogOpen(true)}
        />
        <ToolbarButton
          label="Зураг оруулах"
          icon={ImagePlus}
          onClick={() => setIsImagePickerOpen(true)}
        />
        <div className="ml-auto flex">
          <ToolbarButton
            label="Буцаах"
            icon={Undo2}
            disabled={!state.canUndo}
            onClick={() => chain().undo().run()}
          />
          <ToolbarButton
            label="Дахин хийх"
            icon={Redo2}
            disabled={!state.canRedo}
            onClick={() => chain().redo().run()}
          />
        </div>
      </div>

      <MediaPicker
        open={isImagePickerOpen}
        onOpenChange={setIsImagePickerOpen}
        title="Текстэнд зураг оруулах"
        onSelect={(media) =>
          chain().setImage({ src: media.url, alt: media.originalName }).run()
        }
      />

      <LinkDialog
        open={isLinkDialogOpen}
        onOpenChange={setIsLinkDialogOpen}
        initialHref={state.currentLink}
        onSubmit={applyLink}
      />
    </>
  );
}
