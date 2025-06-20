import { useEffect, useRef, useState } from 'react';

export function useAutoFontSize(
  value: string,
  containerWidth: number,
  options = { max: 24, min: 10 }
) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(options.max);

  useEffect(() => {
    const span = spanRef.current;
    if (!span) return;

    span.textContent = value || '0';

    const resizeFont = () => {
      const currentWidth = span.offsetWidth;

      if (currentWidth > containerWidth && fontSize > options.min) {
        setFontSize((prev) => prev - 1);
      } else if (currentWidth < containerWidth - 20 && fontSize < options.max) {
        setFontSize((prev) => prev + 1);
      }
    };

    resizeFont();
  }, [value, containerWidth, fontSize]);

  return { fontSize, spanRef };
}
