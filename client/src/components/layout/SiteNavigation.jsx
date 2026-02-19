import { SITE_NAV_ITEMS } from "./siteNavConfig";

export default function SiteNavigation({
  centered = false,
  onItemClick,
  showMobileOnly = false,
}) {
  const navClassName = centered ? "nav-area-items is-centered" : "nav-area-items";
  const navItems = SITE_NAV_ITEMS.filter((item) =>
    showMobileOnly ? true : !item.mobileOnly
  );

  return (
    <nav className={navClassName}>
      <ul>
        {navItems.map((item) => (
          <li key={item.title}>
            <a href={item.href} onClick={onItemClick}>
              {item.title}
            </a>
            <br />
            <span className="nav-small">{item.subtitle}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
