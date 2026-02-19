export default function SiteLogo({
  // デフォルト状態ではトップページへのリンクを設定
  homeHref = "/",
  menuOpen = false,
  onMenuToggle }) {
  return (
    <div className="logo">
      <a className="logo-home" href={homeHref}>
        <img src="/images/nav-top.png" alt="トップ" />
      </a>
      <button
        type="button"
        className="logo-menu-trigger"
        aria-label={menuOpen ? "Ｘ" : "メニューを開く"}
        aria-expanded={menuOpen}
        aria-controls="mobile-site-menu"
        onClick={onMenuToggle}
      >
        <img src="/images/nav-top.png" alt="" />
        <span>{menuOpen ? "CLOSE" : "MENU"}</span>
      </button>
    </div>
  );
}
