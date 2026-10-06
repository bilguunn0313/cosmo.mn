import {
  House,
  Images,
  Info,
  LayoutDashboard,
  Mail,
  Newspaper,
  Tags,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export const DASHBOARD_ITEM: NavItem = {
  title: "Хянах самбар",
  href: "/admin",
  icon: LayoutDashboard,
};

export const NAV_GROUPS: NavGroup[] = [
  {
    items: [DASHBOARD_ITEM],
  },
  {
    label: "Сайтын хуудсууд",
    items: [
      { title: "Нүүр хуудас", href: "/admin/home", icon: House },
      { title: "Бидний тухай", href: "/admin/about", icon: Info },
      { title: "Брэндүүд", href: "/admin/brands", icon: Tags },
      { title: "Хүний нөөц", href: "/admin/human-resources", icon: Users },
      { title: "Медиа", href: "/admin/news", icon: Newspaper },
      { title: "Холбоо барих", href: "/admin/contact", icon: Mail },
    ],
  },
  {
    label: "Ерөнхий",
    items: [
      { title: "Зургийн сан", href: "/admin/media", icon: Images },
      { title: "Админууд", href: "/admin/admins", icon: UserCog },
    ],
  },
];

export function isNavItemActive(item: NavItem, pathname: string) {
  if (item.href === DASHBOARD_ITEM.href) {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function findActiveNavItem(pathname: string) {
  const items = NAV_GROUPS.flatMap((group) => group.items);
  return items.find((item) => isNavItemActive(item, pathname));
}
