"use client";

interface JumpItem {
  id: string;
  label: string;
}

interface CategoryJumpNavProps {
  label: string;
  items: JumpItem[];
}

export function CategoryJumpNav({ label, items }: CategoryJumpNavProps) {
  function jumpTo(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const section = document.getElementById(id);

    if (!section) {
      return;
    }

    event.preventDefault();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    section.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    history.replaceState(null, "", `#${id}`);
  }

  return (
    <nav aria-label={label} className="border-b border-rule">
      <div className="site-container flex min-h-17 items-center gap-6 py-3 lg:min-h-19">
        <span className="hidden text-sm text-ink-2 md:block">{label}:</span>
        <ul className="no-scrollbar -mx-4 flex min-w-0 gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(event) => jumpTo(event, item.id)}
                className="inline-flex h-11 items-center rounded-control bg-surface px-4 text-[15px] font-medium whitespace-nowrap text-ink transition-colors duration-200 hover:bg-brand-100 md:px-5"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
