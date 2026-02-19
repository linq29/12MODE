export default function BlurReveal({
  as: Component = "div",
  className = "",
  reveal = true,
  animate = true,
  children,
  ...rest
}) {
  if (!reveal) {
    return null;
  }

  const mergedClassName = ["blur-reveal", animate ? "is-revealing" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={mergedClassName} {...rest}>
      {children}
    </Component>
  );
}
