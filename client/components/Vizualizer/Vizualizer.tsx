import { useEffect, useRef, useCallback } from 'react';

interface VizualizerProps {
  isRecording: boolean;
}

export const Vizualizer = ({ isRecording }: VizualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  const draw = useCallback(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create animated bars without audio data
    const barCount = 32;
    const barWidth = (canvas.width / barCount) * 2.5;
    let x = 0;

    for (let i = 0; i < barCount; i++) {
      // Create animated height using sine wave and time
      const time = Date.now() * 0.005;
      const frequency = 0.1 + i * 0.05;
      const amplitude = 0.3 + Math.sin(time + i * 0.3) * 0.2;
      const barHeight =
        (Math.sin(time * frequency) * amplitude + 0.5) * canvas.height;

      // Create gradient
      const gradient = ctx.createLinearGradient(
        0,
        canvas.height,
        0,
        canvas.height - barHeight,
      );
      gradient.addColorStop(0, '#9013FE');
      gradient.addColorStop(1, '#FF6B6B');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }

    animationRef.current = requestAnimationFrame(draw);
  }, []);

  const startVisualization = useCallback(async () => {
    try {
      // For now, just start the drawing loop without audio analysis
      // to avoid AudioContext sample rate conflicts with WebSocket
      draw();
    } catch (err) {
      console.error('Visualization error:', err);
    }
  }, [draw]);

  const stopVisualization = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }

    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, []);

  useEffect(() => {
    if (isRecording) {
      startVisualization();
    } else {
      stopVisualization();
    }

    return () => {
      stopVisualization();
    };
  }, [isRecording, startVisualization, stopVisualization]);

  if (!isRecording) {
    return null;
  }

  return (
    <div className="flex justify-center mt-6">
      <canvas
        ref={canvasRef}
        width={280}
        height={60}
        className="rounded-lg bg-gray-800"
      />
    </div>
  );
};
