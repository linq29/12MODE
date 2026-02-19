import { useEffect, useRef, useState } from "react";

export default function FlipImage({
  frontSrc,
  backSrc,
  alt = "",
  className,
  flipDelayMs,
  transitionMs = 600,
}) {
  const [src, setSrc] = useState(frontSrc);
  const [face, setFace] = useState("front");
  const [animationName, setAnimationName] = useState("none");
  const swapTimerRef = useRef(null);
  const finishTimerRef = useRef(null);

  function clearTimers() {
    if (swapTimerRef.current) {
      clearTimeout(swapTimerRef.current);
      swapTimerRef.current = null;
    }

    if (finishTimerRef.current) {
      clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
  }

  useEffect(() => {
    clearTimers();
    setSrc(frontSrc);
    setFace("front");
    setAnimationName("none");
  }, [frontSrc, backSrc]);

  useEffect(
    () => () => {
      clearTimers();
    },
    []
  );

  function spinTo(nextFace) {
    const nextSrc = nextFace === "back" ? backSrc : frontSrc;
    if (!nextSrc) {
      return;
    }

    clearTimers();

    const duration = Math.max(Number(transitionMs) || 0, 0);
    const swapDelay = Math.max(
      Number(flipDelayMs == null ? duration / 2 : flipDelayMs) || 0,
      0
    );
    const nextAnimation = nextFace === "back" ? "spinIn" : "spinOut";

    setAnimationName(nextAnimation);
    swapTimerRef.current = setTimeout(() => {
      setSrc(nextSrc);
      swapTimerRef.current = null;
    }, swapDelay);

    finishTimerRef.current = setTimeout(() => {
      setFace(nextFace);
      setAnimationName("none");
      finishTimerRef.current = null;
    }, duration);
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        transform: `rotateY(${face === "back" ? 180 : 0}deg)`,
        transformStyle: "preserve-3d",
        animationName,
        animationDuration: `${transitionMs}ms`,
        animationTimingFunction: "ease",
        animationFillMode: "forwards",
      }}
      onMouseEnter={() => spinTo("back")}
      onMouseLeave={() => spinTo("front")}
      onFocus={() => spinTo("back")}
      onBlur={() => spinTo("front")}
    />
  );
}
