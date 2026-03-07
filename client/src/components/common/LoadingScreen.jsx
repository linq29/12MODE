export default function LoadingScreen({ message = "ご案内中…", className = "" }) {
  const mergedClassName =
  ["jinja-loading-screen", className].filter(Boolean).join(" ");

  return (
    <div className={mergedClassName} role="status" aria-live="polite">
      <div className="jinja-loading-spinner" aria-hidden="true" />
      <p className="jinja-loading-text blur-reveal is-revealing">{message}</p>
    </div>
  );
}
