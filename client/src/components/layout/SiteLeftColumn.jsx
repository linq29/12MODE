import ViewportBlurReveal from "../common/ViewportBlurReveal";

export default function SiteLeftColumn({
  titleImage = "/images/logo-v.png",
  titleAlt = "",
}) {
  return (
    <div className="left-column">
      <ViewportBlurReveal className="page-title blur-reveal-left">
        <img src={titleImage} alt={titleAlt} />
      </ViewportBlurReveal>
    </div>
  );
}
