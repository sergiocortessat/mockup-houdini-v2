'use client';

import Image, { ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

type ImageWithFallbackProps = ImageProps & {
  fallbackSrc?: string;
};

export default function ImageWithFallback({
  src,
  fallbackSrc = '/assets/token-placeholder.svg',
  alt,
  ...rest
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}
