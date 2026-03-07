export default function SiteFooter({
  siteName = "JUNISHI MODE",
  copyright = "(C) HAL TOKYO LIN QIUJING",
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
