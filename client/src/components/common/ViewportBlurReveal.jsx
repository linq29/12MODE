import { useEffect, useRef, useState } from "react";

export default function ViewportBlurReveal({
  as: Component = "div",
  className = "",
  triggerTopRatio = 0.85,
  once = true,
  children,
  ...rest
}) {
  const elementRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = elementRef.current;
    if (!node || (once && revealed)) {
      return undefined;
    }

    const ratio = Math.max(0, Math.min(1, Number(triggerTopRatio) || 0.65));
    const bottomMarginPercent = Math.round((1 - ratio) * 100);
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) {
          return;
        }

        setRevealed(true);
        if (once) {
          observer.unobserve(node);
          observer.disconnect();
        }
      },
      {
        threshold: 0,
        rootMargin: `0px 0px -${bottomMarginPercent}% 0px`,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [once, revealed, triggerTopRatio]);

  const mergedClassName = [
    "blur-reveal",
    revealed ? "is-revealing" : "is-pending",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component ref={elementRef} className={mergedClassName} {...rest}>
      {children}
    </Component>
  );
}
