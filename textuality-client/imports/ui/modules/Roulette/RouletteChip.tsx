import React from 'react';
import './RouletteChip.css';
import { getImageUrl } from '/imports/services/cloudinary/cloudinary-geturl';

const RouletteChip = ({
  avatar_id,
  zoom,
  width = 80,
  height = 80,
}: {
  avatar_id?: string;
  zoom?: number;
  width?: number;
  height?: number;
}) => {
  return (
    <div className="chip">
      <div className="chipRing">
        {avatar_id && (
          <img src={getImageUrl(avatar_id, { width, height, zoom })} />
        )}
      </div>
    </div>
  );
};

export default RouletteChip;
