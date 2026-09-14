import Image from "next/image";
import { createServerSupabase } from "@/lib/supabaseServer";
import SongList from "@/components/SongList";
import Footer from "@/components/Footer";

export const revalidate = 60;

export default async function BerandaPage() {
  const supabase = createServerSupabase();

  const [{ data: content }, { data: songs }, { data: contact }] =
    await Promise.all([
      supabase.from("site_content").select("data").eq("key", "beranda").single(),
      supabase.from("songs").select("*").order("created_at", { ascending: false }),
      supabase.from("site_content").select("data").eq("key", "kontak").single(),
    ]);

  const beranda = content?.data || {};

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col items-center text-center gap-4">
        <Image
          src={beranda.logo_url || "/logo.jpg"}
          alt="Riabz Microphone"
          width={140}
          height={140}
          className="rounded-full object-cover border border-border"
        />
        <p className="text-sm text-muted max-w-md">{beranda.deskripsi}</p>
      </section>

      <section>
        <h2 className="text-sm font-mono text-muted mb-3">lagu-lagu</h2>
        <SongList songs={songs || []} />
      </section>

      <Footer contact={contact?.data} />
    </div>
  );
}
