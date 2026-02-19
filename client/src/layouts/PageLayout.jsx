import { useEffect, useState } from "react";
import SiteDecorations from "../components/layout/SiteDecorations";
import SiteLeftColumn from "../components/layout/SiteLeftColumn";
import SiteLogo from "../components/layout/SiteLogo";
import SiteNavigation from "../components/layout/SiteNavigation";
import SiteRightColumn from "../components/layout/SiteRightColumn";

export default function PageLayout({
  bodyClass = "",
  pageTitle = "十二支詣",
  titleImage,
  titleAlt,
  children,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.className = bodyClass;
    document.title = pageTitle;

    return () => {
      document.body.className = "";
    };
  }, [bodyClass, pageTitle]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = "";
      return undefined;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const desktopMediaQuery = window.matchMedia("(min-width: 1025px)");

    function handleDesktopSwitch(event) {
      if (event.matches) {
        setMobileMenuOpen(false);
      }
    }

    desktopMediaQuery.addEventListener("change", handleDesktopSwitch);

    return () => {
      desktopMediaQuery.removeEventListener("change", handleDesktopSwitch);
    };
  }, []);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <SiteDecorations />
      <SiteLogo
        menuOpen={mobileMenuOpen}
        onMenuToggle={() => setMobileMenuOpen((open) => !open)}
      />
      <div
        id="mobile-site-menu"
        className={mobileMenuOpen ? "mobile-menu is-open" : "mobile-menu"}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div className="mobile-menu-panel" onClick={(event) => event.stopPropagation()}>
          <SiteNavigation
            centered
            showMobileOnly
            onItemClick={() => setMobileMenuOpen(false)}
          />
        </div>
      </div>
      <div className="body-wrapper">
        <SiteLeftColumn titleImage={titleImage} titleAlt={titleAlt} />
        <div className="center-column">{children}</div>
        <SiteRightColumn />
      </div>
    </>
  );
}
