import { Link } from "@/i18n/navigation";
import { isExternalUrl } from "@/lib/site-links";

interface SmartLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export function SmartLink({ href, className, children }: SmartLinkProps) {
  if (isExternalUrl(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
