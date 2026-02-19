export default function SpinRevealImage({
  id,
  src,
  alt = "",
  visible = false,
  triggerKey = 0,
  className = "",
}) {
  if (!visible || !src) {
    return null;
  }

  const mergedClassName = ["spin-reveal-image", "is-revealing", className]
    .filter(Boolean)
    .join(" ");

  return <img key={triggerKey} id={id} src={src} alt={alt} className={mergedClassName} />;
}
