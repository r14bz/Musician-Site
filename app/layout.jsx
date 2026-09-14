import "./globals.css";
import Navbar from "@/components/Navbar";
import GlobalPlayer from "@/components/GlobalPlayer";
import { PlayerProvider } from "@/lib/PlayerContext";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Riabz Microphone",
    template: "%s — Riabz Microphone",
  },
  description:
    "Dengarkan lagu-lagu terbaru dari Riabz Microphone. Streaming, download, dan hubungi langsung.",
  openGraph: {
    title: "Riabz Microphone",
    description:
      "Dengarkan lagu-lagu terbaru dari Riabz Microphone.",
    url: siteUrl,
    siteName: "Riabz Microphone",
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <PlayerProvider>
          <Navbar />
          <main className="max-w-3xl mx-auto px-6 pt-4 pb-24">{children}</main>
          <GlobalPlayer />
        </PlayerProvider>
      </body>
    </html>
  );
}
