import LoadingScreen from "./LoadingScreen";
import { DEFAULT_LOADING_MESSAGE } from "../../data/loadingMessageText";

export default function LoadingMessage({
  variant = "inline",
  message = DEFAULT_LOADING_MESSAGE,
  as = "p",
  className = "",
}) {
  if (variant === "screen") {
    return <LoadingScreen message={message} className={className} />;
  }

  const Tag = as;
  const mergedClassName = [className || "jinja-step-note"].filter(Boolean).join(" ");

  return <Tag className={mergedClassName}>{message}</Tag>;
}
