import React, { useRef } from 'react';
import './RouletteChip.css';
import { getImageUrl } from '/imports/services/cloudinary/cloudinary-geturl';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const RouletteChip = ({
  avatar_id,
  rotate,
  zoom,
  width = 80,
  height = 80,
  color,
  animateIn,
}: {
  avatar_id?: string;
  rotate?: boolean;
  zoom?: number;
  width?: number;
  height?: number;
  color?: string;
  animateIn?: boolean;
}) => {
  const chip = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!animateIn || !chip.current) return;

    // Move the chip towards the center when its large
    const rect = chip.current.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const chipCenterX = rect.left + rect.width / 2;
    const chipCenterY = rect.top + rect.height / 2;
    const deltaX = (centerX - chipCenterX) / 3;
    const deltaY = (centerY - chipCenterY) / 3;

    const tl = gsap.timeline();
    tl.set(chip.current, { rotateY: 0, zIndex: 100 });
    tl.to(chip.current, {
      scale: 10.0,
      x: deltaX,
      y: deltaY,
      duration: 0.6,
      ease: 'power1.out',
    });
    tl.to(chip.current, {
      scale: 1,
      x: 0,
      y: 0,
      duration: 0.8,
      rotateY: 720,
      ease: 'power1.in',
    });
    tl.set(chip.current, { zIndex: 'auto' });
  }, [avatar_id]);

  return (
    <div
      ref={chip}
      className={rotate ? 'rotate chip' : 'chip'}
      style={color ? { background: color } : undefined}
    >
      <svg className="chipRing" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" className="dashed-circle"></circle>
      </svg>
      {avatar_id && (
        <img src={getImageUrl(avatar_id, { width, height, zoom })} />
      )}
    </div>
  );
};

export default RouletteChip;
