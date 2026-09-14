import SocialIcons from "@/components/SocialIcons";

export default function Footer({ contact }) {
  return (
    <footer className="border-t border-border mt-16 py-8 flex flex-col items-center gap-4">
      <SocialIcons contact={contact} />
      <p className="text-xs text-muted">
        © {new Date().getFullYear()} Riabz Microphone
      </p>
    </footer>
  );
}
