import { createServerSupabase } from "@/lib/supabaseServer";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const supabase = createServerSupabase();

  const [{ data: songs }, { data: contentRows }, { data: videos }] = await Promise.all([
    supabase.from("songs").select("*").order("created_at", { ascending: false }),
    supabase.from("site_content").select("key, data"),
    supabase.from("videos").select("*").order("created_at", { ascending: false }),
  ]);

  const content = {};
  (contentRows || []).forEach((row) => {
    content[row.key] = row.data;
  });

  return (
    <AdminDashboard
      initialSongs={songs || []}
      initialContent={content}
      initialVideos={videos || []}
    />
  );
}
