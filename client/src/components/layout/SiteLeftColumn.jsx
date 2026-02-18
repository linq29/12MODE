export default function SiteLeftColumn({
  titleImage = "/images/logo-v.png",
  titleAlt = "",
}) {
  return (
    <div className="left-column">
      <div className="page-title">
        <img src={titleImage} alt={titleAlt} />
      </div>
    </div>
  );
}
