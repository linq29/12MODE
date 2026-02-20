export default function EmphasisLink({
  as: Component = "a",
  className = "",
  children,
  ...rest
}) {
  const mergedClassName = ["emphasis-link", className].filter(Boolean).join(" ");

  return (
    <Component className={mergedClassName} {...rest}>
      {children}
    </Component>
  );
}
