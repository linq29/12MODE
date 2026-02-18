import { useEffect } from "react";
import SiteDecorations from "../components/layout/SiteDecorations";
import SiteLeftColumn from "../components/layout/SiteLeftColumn";
import SiteLogo from "../components/layout/SiteLogo";
import SiteRightColumn from "../components/layout/SiteRightColumn";

export default function PageLayout({
  bodyClass = "",
  pageTitle = "十二支詣",
  titleImage,
  titleAlt,
  children,
}) {
  useEffect(() => {
    document.body.className = bodyClass;
    document.title = pageTitle;

    return () => {
      document.body.className = "";
    };
  }, [bodyClass, pageTitle]);

  return (
    <>
      <SiteDecorations />
      <SiteLogo />
      <div className="body-wrapper">
        <SiteLeftColumn titleImage={titleImage} titleAlt={titleAlt} />
        <div className="center-column">{children}</div>
        <SiteRightColumn />
      </div>
    </>
  );
}
