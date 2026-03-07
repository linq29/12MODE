import { DEFAULT_LOADING_MESSAGE } from "../../data/loadingMessageText";

export default function LoadingScreen({ message = DEFAULT_LOADING_MESSAGE, className = "" }) {
  const mergedClassName =
  ["jinja-loading-screen", className].filter(Boolean).join(" ");

  return (
    <div className={mergedClassName} role="status" aria-live="polite">
      <div className="jinja-loading-spinner" aria-hidden="true" />
      <p className="jinja-loading-text blur-reveal is-revealing">{message}</p>
    </div>
  );
}
