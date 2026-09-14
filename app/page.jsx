import Image from "next/image";
import { createServerSupabase } from "@/lib/supabaseServer";
import SongList from "@/components/SongList";
import VideoSection from "@/components/VideoSection";
import Footer from "@/components/Footer";

export const revalidate = 60;

export default async function BerandaPage() {
  const supabase = createServerSupabase();

  const [{ data: content }, { data: songs }, { data: contact }, { data: videos }] =
    await Promise.all([
      supabase.from("site_content").select("data").eq("key", "beranda").single(),
      supabase.from("songs").select("*").order("created_at", { ascending: false }),
      supabase.from("site_content").select("data").eq("key", "kontak").single(),
      supabase.from("videos").select("*").order("created_at", { ascending: false }),
    ]);

  const beranda = content?.data || {};

  return (
    <div className="flex flex-col gap-14">
      <section className="relative flex flex-col md:flex-row items-center gap-6 -mx-6 px-6 pb-6">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, #5EEAD4 0%, transparent 45%), radial-gradient(circle at 80% 60%, #EF4444 0%, transparent 40%)",
          }}
        />

        <div className="relative w-44 h-60 rounded-3xl overflow-hidden border border-border bg-surface shrink-0">
          <Image
            src={beranda.logo_url || "/logo.jpg"}
            alt="Riabz Microphone"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
          <h1 className="text-2xl font-medium">Riabz Microphone</h1>
          <p className="text-sm text-muted max-w-md">{beranda.deskripsi}</p>
          <a
            href="#daftar-lagu"
            className="inline-flex items-center gap-2 bg-accent text-black text-sm font-medium rounded-full px-5 py-2.5 hover:opacity-90 transition-opacity"
          >
            Dengarkan sekarang
          </a>
        </div>
      </section>

      <section id="daftar-lagu">
        <h2 className="text-sm font-mono text-muted mb-3">lagu-lagu</h2>
        <SongList songs={songs || []} />
      </section>

      <VideoSection videos={videos || []} />

      <Footer contact={contact?.data} />
    </div>
  );
}
