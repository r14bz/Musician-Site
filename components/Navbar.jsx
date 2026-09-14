"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/kontak", label: "Kontak" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border">
      <nav className="max-w-3xl mx-auto flex items-center justify-center gap-6 px-6 py-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm transition-colors ${
              pathname === link.href
                ? "text-white"
                : "text-muted hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
