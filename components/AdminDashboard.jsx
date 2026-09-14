"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { Trash2, Upload, LogOut, Pencil, Check, X } from "lucide-react";

const tabs = ["Lagu", "Beranda", "Profil", "Kontak"];

export default function AdminDashboard({ initialSongs, initialContent }) {
  const router = useRouter();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState("Lagu");
  const [songs, setSongs] = useState(initialSongs);
  const [content, setContent] = useState(initialContent);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingSongId, setEditingSongId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  async function handleUploadSong(e) {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value.trim();
    const file = form.file.files[0];

    if (!title || !file) {
      setMessage("Judul dan file lagu wajib diisi.");
      return;
    }

    setUploading(true);
    setMessage("");

    const filePath = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("songs")
      .upload(filePath, file);

    if (uploadError) {
      setMessage("Gagal upload file: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("songs")
      .getPublicUrl(filePath);

    const { data: inserted, error: insertError } = await supabase
      .from("songs")
      .insert({
        title,
        audio_url: publicUrlData.publicUrl,
        file_path: filePath,
      })
      .select()
      .single();

    setUploading(false);

    if (insertError) {
      setMessage("Gagal menyimpan data lagu: " + insertError.message);
      return;
    }

    setSongs([inserted, ...songs]);
    form.reset();
    setMessage("Lagu berhasil diupload.");
  }

  function startEditSong(song) {
    setEditingSongId(song.id);
    setEditingTitle(song.title);
  }

  function cancelEditSong() {
    setEditingSongId(null);
    setEditingTitle("");
  }

  async function handleSaveSongTitle(song) {
    const newTitle = editingTitle.trim();
    if (!newTitle) {
      setMessage("Judul tidak boleh kosong.");
      return;
    }

    const { error } = await supabase
      .from("songs")
      .update({ title: newTitle })
      .eq("id", song.id);

    if (error) {
      setMessage("Gagal mengubah judul: " + error.message);
      return;
    }

    setSongs(songs.map((s) => (s.id === song.id ? { ...s, title: newTitle } : s)));
    setEditingSongId(null);
    setEditingTitle("");
    setMessage("Judul lagu diperbarui.");
  }

  async function handleUploadLogo(e) {
    const file = e.target.files[0];
    if (!file) return;

    setLogoUploading(true);
    setMessage("");

    const filePath = `logo-${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("branding")
      .upload(filePath, file);

    if (uploadError) {
      setMessage("Gagal upload foto: " + uploadError.message);
      setLogoUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("branding")
      .getPublicUrl(filePath);

    const updatedBeranda = {
      ...content.beranda,
      logo_url: publicUrlData.publicUrl,
    };
    setContent({ ...content, beranda: updatedBeranda });

    const { error: saveError } = await supabase
      .from("site_content")
      .update({ data: updatedBeranda, updated_at: new Date().toISOString() })
      .eq("key", "beranda");

    setLogoUploading(false);

    if (saveError) {
      setMessage("Foto terupload tapi gagal disimpan: " + saveError.message);
      return;
    }

    setMessage("Foto beranda berhasil diperbarui.");
  }

  async function handleDeleteSong(song) {
    if (!confirm(`Hapus lagu "${song.title}"?`)) return;

    await supabase.storage.from("songs").remove([song.file_path]);
    await supabase.from("songs").delete().eq("id", song.id);
    setSongs(songs.filter((s) => s.id !== song.id));
  }

  async function handleSaveContent(key) {
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("site_content")
      .update({ data: content[key], updated_at: new Date().toISOString() })
      .eq("key", key);

    setSaving(false);

    if (error) {
      setMessage("Gagal menyimpan: " + error.message);
      return;
    }

    setMessage("Perubahan disimpan.");
  }

  function updateField(key, field, value) {
    setContent({
      ...content,
      [key]: { ...content[key], [field]: value },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Dashboard admin</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-white transition-colors"
        >
          <LogOut size={15} /> Keluar
        </button>
      </div>

      <div className="flex gap-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-sm border-b-2 transition-colors ${
              activeTab === tab
                ? "border-accent text-white"
                : "border-transparent text-muted hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {message && <p className="text-sm text-accent">{message}</p>}

      {activeTab === "Lagu" && (
        <div className="flex flex-col gap-6">
          <form
            onSubmit={handleUploadSong}
            className="flex flex-col gap-3 border border-border rounded-xl p-4 bg-surface"
          >
            <p className="text-sm font-medium">Upload lagu baru</p>
            <input
              name="title"
              placeholder="Judul lagu"
              className="bg-base border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <input
              name="file"
              type="file"
              accept="audio/*"
              className="text-sm text-muted"
            />
            <button
              type="submit"
              disabled={uploading}
              className="flex items-center justify-center gap-2 bg-accent text-black text-sm font-medium rounded-lg py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Upload size={15} />
              {uploading ? "Mengupload..." : "Upload"}
            </button>
          </form>

          <div className="flex flex-col divide-y divide-border border border-border rounded-xl overflow-hidden">
            {songs.map((song) => (
              <div
                key={song.id}
                className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                {editingSongId === song.id ? (
                  <>
                    <input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="flex-1 bg-base border border-border rounded-lg px-2 py-1 text-sm outline-none focus:border-accent"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveSongTitle(song)}
                      aria-label="Simpan judul"
                      className="text-accent hover:opacity-80 transition-opacity"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={cancelEditSong}
                      aria-label="Batal"
                      className="text-muted hover:text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 truncate">{song.title}</span>
                    <button
                      onClick={() => startEditSong(song)}
                      aria-label="Edit judul"
                      className="text-muted hover:text-white transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteSong(song)}
                      aria-label="Hapus lagu"
                      className="text-muted hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            ))}
            {songs.length === 0 && (
              <p className="px-4 py-3 text-sm text-muted">Belum ada lagu.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "Beranda" && (
        <div className="flex flex-col gap-3 border border-border rounded-xl p-4 bg-surface">
          <label className="text-sm text-muted">Foto beranda</label>
          {content.beranda?.logo_url && (
            <img
              src={content.beranda.logo_url}
              alt="Preview foto beranda"
              className="w-24 h-24 rounded-full object-cover border border-border"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadLogo}
            disabled={logoUploading}
            className="text-sm text-muted"
          />
          {logoUploading && (
            <p className="text-xs text-muted">Mengupload foto...</p>
          )}
          <label className="text-sm text-muted">Deskripsi singkat</label>
          <textarea
            value={content.beranda?.deskripsi || ""}
            onChange={(e) => updateField("beranda", "deskripsi", e.target.value)}
            rows={3}
            className="bg-base border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button
            onClick={() => handleSaveContent("beranda")}
            disabled={saving}
            className="self-start bg-accent text-black text-sm font-medium rounded-lg px-4 py-2 hover:opacity-90 transition-opacity"
          >
            Simpan
          </button>
        </div>
      )}

      {activeTab === "Profil" && (
        <div className="flex flex-col gap-3 border border-border rounded-xl p-4 bg-surface">
          <label className="text-sm text-muted">Deskripsi tentang diri kamu</label>
          <textarea
            value={content.profil?.deskripsi || ""}
            onChange={(e) => updateField("profil", "deskripsi", e.target.value)}
            rows={8}
            className="bg-base border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button
            onClick={() => handleSaveContent("profil")}
            disabled={saving}
            className="self-start bg-accent text-black text-sm font-medium rounded-lg px-4 py-2 hover:opacity-90 transition-opacity"
          >
            Simpan
          </button>
        </div>
      )}

      {activeTab === "Kontak" && (
        <div className="flex flex-col gap-3 border border-border rounded-xl p-4 bg-surface">
          {["email", "whatsapp", "facebook", "instagram", "x", "youtube"].map(
            (field) => (
              <div key={field} className="flex flex-col gap-1">
                <label className="text-sm text-muted capitalize">{field}</label>
                <input
                  value={content.kontak?.[field] || ""}
                  onChange={(e) => updateField("kontak", field, e.target.value)}
                  placeholder={
                    field === "whatsapp" ? "62812xxxxxxx" : "https://..."
                  }
                  className="bg-base border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>
            )
          )}
          <button
            onClick={() => handleSaveContent("kontak")}
            disabled={saving}
            className="self-start bg-accent text-black text-sm font-medium rounded-lg px-4 py-2 hover:opacity-90 transition-opacity"
          >
            Simpan
          </button>
        </div>
      )}
    </div>
  );
}
