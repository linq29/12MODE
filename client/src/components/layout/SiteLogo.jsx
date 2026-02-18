export default function SiteLogo({ homeHref = "/" }) {
  return (
    <div className="logo">
      <a href={homeHref}>
        <img src="/images/nav-top.png" alt="トップ" />
      </a>
    </div>
  );
}
