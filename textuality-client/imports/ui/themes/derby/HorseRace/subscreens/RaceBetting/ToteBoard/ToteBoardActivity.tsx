import React, { useEffect } from 'react';
// import { ScreenEffect } from '/imports/utils/screen-effect';
import '/imports/utils/screen-effect.css';

export const ToteBoardActivity = () => {
  // useEffect(() => {
  //   const screen = new ScreenEffect('#tote-board-screen', {
  //     vignette: true,
  //   });
  //   return () => {
  //     screen.destroy();
  //   };
  // }, []);

  return (
    <div className="tote-board-activity" id="tote-board-screen">
      <video
        src="/casino/videos/gray.mp4"
        autoPlay
        loop
        playsInline
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
};
