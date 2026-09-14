export default function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return [
    { url: `${siteUrl}/`, lastModified: new Date(), priority: 1 },
    { url: `${siteUrl}/profil`, lastModified: new Date(), priority: 0.8 },
    { url: `${siteUrl}/kontak`, lastModified: new Date(), priority: 0.8 },
  ];
}
