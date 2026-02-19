export default function GoldenButton({
  as: Component = "button",
  className = "",
  type = "button",
  children,
  ...rest
}) {
  const mergedClassName = ["golden-btn", className].filter(Boolean).join(" ");

  if (Component === "button") {
    return (
      <button type={type} className={mergedClassName} {...rest}>
        {children}
      </button>
    );
  }

  return (
    <Component className={mergedClassName} {...rest}>
      {children}
    </Component>
  );
}
