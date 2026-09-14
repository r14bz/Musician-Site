import { createServerSupabase } from "@/lib/supabaseServer";
import SocialIcons from "@/components/SocialIcons";
import { Mail } from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "Kontak",
  description: "Hubungi saya lewat email, WhatsApp, atau media sosial.",
};

export default async function KontakPage() {
  const supabase = createServerSupabase();
  const { data: content } = await supabase
    .from("site_content")
    .select("data")
    .eq("key", "kontak")
    .single();

  const kontak = content?.data || {};

  const rows = [
    { label: "Email", value: kontak.email, href: `mailto:${kontak.email}` },
    {
      label: "WhatsApp",
      value: kontak.whatsapp,
      href: kontak.whatsapp
        ? `https://wa.me/${kontak.whatsapp.replace(/\D/g, "")}`
        : null,
    },
    { label: "Instagram", value: kontak.instagram, href: kontak.instagram },
    { label: "Facebook", value: kontak.facebook, href: kontak.facebook },
    { label: "X", value: kontak.x, href: kontak.x },
    { label: "YouTube", value: kontak.youtube, href: kontak.youtube },
  ].filter((row) => row.value);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-medium">Kontak</h1>

      <div className="flex flex-col divide-y divide-border border border-border rounded-xl overflow-hidden">
        {rows.map((row) => (
          <a
            key={row.label}
            href={row.href}
            target={row.label === "Email" || row.label === "WhatsApp" ? "_self" : "_blank"}
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-3 text-sm hover:bg-surface transition-colors"
          >
            <span className="text-muted">{row.label}</span>
            <span className="truncate max-w-[60%] text-right">{row.value}</span>
          </a>
        ))}
      </div>

      <SocialIcons contact={kontak} />
    </div>
  );
}
