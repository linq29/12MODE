export default function SiteFooter({
  siteName = "JYUNISHI MODE",
  copyright = "(C) TOKYOU PI006 LIN QIUJING",
}) {
  return (
    <footer>
      <p className="footer">
        {siteName}
        <br />
        {copyright}
      </p>
    </footer>
  );
}
