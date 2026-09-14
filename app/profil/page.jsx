import { createServerSupabase } from "@/lib/supabaseServer";

export const revalidate = 60;

export const metadata = {
  title: "Profil",
  description: "Kenali lebih dekat perjalanan musik saya dari awal mula.",
};

export default async function ProfilPage() {
  const supabase = createServerSupabase();
  const { data: content } = await supabase
    .from("site_content")
    .select("data")
    .eq("key", "profil")
    .single();

  const profil = content?.data || {};

  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="text-lg font-medium mb-4">Profil</h1>
      <p className="text-sm text-muted leading-relaxed whitespace-pre-line">
        {profil.deskripsi}
      </p>
    </article>
  );
}
