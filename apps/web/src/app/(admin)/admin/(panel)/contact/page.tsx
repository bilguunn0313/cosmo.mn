import type { Metadata } from "next";
import { ContactAdmin } from "@/components/admin/contact/contact-admin";

export const metadata: Metadata = { title: "Холбоо барих" };

export default function ContactPage() {
  return <ContactAdmin />;
}
