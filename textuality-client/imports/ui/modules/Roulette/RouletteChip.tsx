import React, { useRef, useLayoutEffect } from 'react';
import './RouletteChip.css';
import { getImageUrl } from '/imports/services/cloudinary/cloudinary-geturl';

const RouletteChip = ({
  avatar_id,
  rotate,
  zoom,
  width = 80,
  height = 80,
}: {
  avatar_id?: string;
  rotate?: boolean;
  zoom?: number;
  width?: number;
  height?: number;
}) => {
  const el = useRef();
  useLayoutEffect(() => {
    el.current.style.animation = 'none';
    el.current.offsetHeight; /* trigger reflow */
    el.current.style.animation = '';
  }, [avatar_id]);

  return (
    <div ref={el} className={rotate ? 'rotate chip' : 'chip'}>
      <div className="chipRing">
        {avatar_id && (
          <img src={getImageUrl(avatar_id, { width, height, zoom })} />
        )}
      </div>
    </div>
  );
};

export default RouletteChip;
