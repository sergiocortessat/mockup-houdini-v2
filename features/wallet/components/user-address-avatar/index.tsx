import { useEffect, useRef } from 'react';

interface Props {
  address: string;
  size?: number;
  scale?: number;
}

const hashString = (str: string): Promise<Uint8Array> => {
  const encoder = new TextEncoder();
  return crypto.subtle
    .digest('SHA-256', encoder.encode(str))
    .then((hash) => new Uint8Array(hash));
};

const drawIdenticon = (
  ctx: CanvasRenderingContext2D,
  hash: Uint8Array,
  size: number,
  scale: number
) => {
  const dimension = size * scale;
  const half = Math.ceil(size / 2);

  // Create circular clip path
  ctx.beginPath();
  ctx.arc(dimension / 2, dimension / 2, dimension / 2, 0, Math.PI * 2);
  ctx.clip();

  // Optional: Fill background
  ctx.fillStyle = '#F9FAFB';
  ctx.fillRect(0, 0, dimension, dimension);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < half; x++) {
      const i = y * half + x;
      const value = hash[i] % 2;
      const fill = value ? '#A955f7' : '#F9FAFB';

      ctx.fillStyle = fill;
      ctx.fillRect(x * scale, y * scale, scale, scale);
      // Mirror the x-coordinate for symmetry
      ctx.fillRect((size - x - 1) * scale, y * scale, scale, scale);
    }
  }
};

export const UserAddressAvatar = ({ address, size = 5, scale = 20 }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    hashString(address.toLowerCase()).then((hash) => {
      drawIdenticon(ctx, hash, size, scale);
    });
  }, [address, size, scale]);

  const dimension = size * scale;

  return (
    <div
      style={{
        width: dimension,
        height: dimension,
        borderRadius: '50%',
        overflow: 'hidden',
      }}
      className="shrink-0"
    >
      <canvas ref={canvasRef} width={dimension} height={dimension} />
    </div>
  );
};
