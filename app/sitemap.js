import { createServerSupabase } from "@/lib/supabaseServer";

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const supabase = createServerSupabase();
  const { data: songs } = await supabase.from("songs").select("id, created_at");

  const songUrls = (songs || []).map((song) => ({
    url: `${siteUrl}/lagu/${song.id}`,
    lastModified: song.created_at,
    priority: 0.6,
  }));

  return [
    { url: `${siteUrl}/`, lastModified: new Date(), priority: 1 },
    { url: `${siteUrl}/profil`, lastModified: new Date(), priority: 0.8 },
    { url: `${siteUrl}/kontak`, lastModified: new Date(), priority: 0.8 },
    ...songUrls,
  ];
}
