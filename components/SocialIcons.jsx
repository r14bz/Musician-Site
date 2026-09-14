"use client";

import { Facebook, Instagram, Youtube, Mail } from "lucide-react";

function XIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="currentColor"
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WhatsAppIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="currentColor"
      {...props}
    >
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.44 9.9-9.9S17.5 2 12.04 2zm0 18.1a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.11.82.83-3.03-.2-.31a8.2 8.2 0 1 1 6.96 3.84zm4.5-6.13c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.96-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.24-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.42h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.04 0 1.2.88 2.37 1 2.53.12.16 1.73 2.64 4.2 3.7.59.25 1.05.4 1.4.51.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.67-1.17.2-.58.2-1.08.14-1.18-.06-.1-.23-.16-.48-.28z" />
    </svg>
  );
}

const iconMap = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  x: XIcon,
  whatsapp: WhatsAppIcon,
  email: Mail,
};

export default function SocialIcons({ contact, size = 20 }) {
  const items = [
    { key: "instagram", href: contact?.instagram },
    { key: "facebook", href: contact?.facebook },
    { key: "x", href: contact?.x },
    { key: "youtube", href: contact?.youtube },
    {
      key: "whatsapp",
      href: contact?.whatsapp
        ? `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`
        : null,
    },
    {
      key: "email",
      href: contact?.email ? `mailto:${contact.email}` : null,
    },
  ].filter((item) => item.href);

  if (items.length === 0) return null;

  return (
    <div className="flex gap-4">
      {items.map((item) => {
        const Icon = iconMap[item.key];
        return (
          <a
            key={item.key}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.key}
            className="text-muted hover:text-accent transition-colors"
          >
            <Icon size={size} />
          </a>
        );
      })}
    </div>
  );
}
