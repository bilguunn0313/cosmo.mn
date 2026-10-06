"use client";

import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { cn } from "@/lib/utils";
import { RichTextToolbar } from "./rich-text-toolbar";

interface RichTextEditorProps {
  id: string;
  value: string;
  onChange: (html: string) => void;
  invalid?: boolean;
}

export function RichTextEditor({
  id,
  value,
  onChange,
  invalid = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
    editorProps: {
      attributes: {
        id,
        class: "rich-text min-h-48 px-3 py-2.5 outline-none",
      },
    },
  });

  return (
    <div
      data-invalid={invalid || undefined}
      className={cn(
        "overflow-hidden rounded-md border border-input shadow-xs transition-[box-shadow,border-color] duration-150",
        "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        "data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20",
      )}
    >
      {editor && <RichTextToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
