import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-mono text-xs text-muted-2">
          © {new Date().getFullYear()} {profile.name}. Built with Next.js.
        </p>
        <p className="font-mono text-xs text-muted-2">{profile.location}</p>
      </div>
    </footer>
  );
}
