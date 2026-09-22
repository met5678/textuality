import React, { useRef, useLayoutEffect } from 'react';
import './RouletteChip.css';
import { getImageUrl } from '/imports/services/cloudinary/cloudinary-geturl';

const RouletteChip = ({
  avatar_id,
  rotate,
  zoom,
  width = 80,
  height = 80,
  color,
}: {
  avatar_id?: string;
  rotate?: boolean;
  zoom?: number;
  width?: number;
  height?: number;
  color?: string;
}) => {
  const el = useRef();
  useLayoutEffect(() => {
    el.current.style.animation = 'none';
    el.current.offsetHeight; /* trigger reflow */
    el.current.style.animation = '';
  }, [avatar_id]);

  return (
    <div
      ref={el}
      className={rotate ? 'rotate chip' : 'chip'}
      style={color ? { background: color } : undefined}
    >
      <div className="chipRing">
        <svg className="chipRing" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" className="dashed-circle"></circle>
        </svg>
        {avatar_id && (
          <img src={getImageUrl(avatar_id, { width, height, zoom })} />
        )}
      </div>
    </div>
  );
};

export default RouletteChip;
