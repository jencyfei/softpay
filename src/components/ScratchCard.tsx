/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";

interface ScratchCardProps {
  imageUrl: string;
  onReveal?: () => void;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({ imageUrl, onReveal }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);

  // Canvas initialization - set dimensions and draw initial overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match the underlying image
    const img = canvas.previousElementSibling as HTMLImageElement;
    if (!img) return;

    // Wait for image to load to get correct dimensions
    const initCanvas = () => {
      canvas.width = img.offsetWidth;
      canvas.height = img.offsetHeight;

      // Fill canvas with matte cream color
      ctx.fillStyle = '#F5F5DC';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw centered text
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Scratch to reveal art', canvas.width / 2, canvas.height / 2);
    };

    if (img.complete) {
      initCanvas();
    } else {
      img.addEventListener('load', initCanvas);
      return () => img.removeEventListener('load', initCanvas);
    }
  }, [imageUrl]);

  // Check reveal percentage and trigger reveal if > 50%
  const checkRevealPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let clearedPixels = 0;
    // Check alpha channel (every 4th value) - 0 means cleared
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) clearedPixels++;
    }

    const totalPixels = pixels.length / 4;
    const percentage = (clearedPixels / totalPixels) * 100;

    if (percentage > 50) {
      setIsRevealed(true);
      onReveal?.();
    }
  };

  // Scratch interaction handler
  const handleScratch = (e: MouseEvent | TouchEvent) => {
    if (!isScratching || isRevealed) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e 
      ? e.touches[0].clientX - rect.left 
      : (e as MouseEvent).clientX - rect.left;
    const y = 'touches' in e 
      ? e.touches[0].clientY - rect.top 
      : (e as MouseEvent).clientY - rect.top;

    // Save current state
    ctx.save();
    
    // Clear circular area (brush effect) with 20px radius
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Restore state
    ctx.restore();

    // Check if we've revealed enough
    checkRevealPercentage();
  };

  // Event handlers setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const handleStart = () => setIsScratching(true);
    const handleEnd = () => setIsScratching(false);

    // Mouse events
    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mousemove', handleScratch as any);
    canvas.addEventListener('mouseleave', handleEnd);

    // Touch events
    canvas.addEventListener('touchstart', handleStart);
    canvas.addEventListener('touchend', handleEnd);
    canvas.addEventListener('touchmove', handleScratch as any);

    return () => {
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mouseup', handleEnd);
      canvas.removeEventListener('mousemove', handleScratch as any);
      canvas.removeEventListener('mouseleave', handleEnd);
      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchend', handleEnd);
      canvas.removeEventListener('touchmove', handleScratch as any);
    };
  }, [isScratching, isRevealed]);

  return (
    <div className="relative w-full">
      <img 
        src={imageUrl} 
        alt="Blind Box Card" 
        className="w-full h-auto rounded-lg"
      />
      {!isRevealed && (
        <motion.canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-pointer rounded-lg"
          animate={{ opacity: isRevealed ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </div>
  );
};
