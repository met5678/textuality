import React from 'react';
import './RouletteChip.css';
import { getImageUrl } from '/imports/services/cloudinary/cloudinary-geturl';

const RouletteChip = (
  { avatar_id }: { avatar_id?: string },
  { zoom }: { zoom?: number },
) => {
  return (
    <div className="chip">
      <div className="chipRing">
        {avatar_id && (
          <img src={getImageUrl(avatar_id, { width: 80, height: 80, zoom })} />
        )}
      </div>
    </div>
  );
};

export default RouletteChip;
