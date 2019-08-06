import React from 'react';

const AchievementBox = () => {
  return (
    <div className="achievementBox">
      <div className="achievementBox-title">
        <div className="achievementBox-au">- Achievement Unlocked -</div>
        <div className="achievementBox-name">Is peeing right now</div>
      </div>
      <div className="achievementBox-player">
        <img
          className="achievementBox-avatar"
          src="http://res.cloudinary.com/datodq9yr/image/upload/c_thumb,g_face,h_400,w_400,z_0.75/wfpjtpht4haxk3jivgf1"
        />
        <div className="achievementBox-alias">ParticleEffects</div>
        <div className="achievementBox-hearts hearts">
          <span className="full" />
          <span className="full" />
          <span className="full" />
          <span className="half flash" />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
};

export default AchievementBox;
