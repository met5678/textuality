import React from 'react';
import classnames from 'classnames';

const Hearts = ({
  unlocks,
  totalAchievements,
  flashLatest,
  sparkleOnFull,
  className = ''
}) => {
  const sparkle = sparkleOnFull && unlocks >= totalAchievements;
  const fullHearts = Math.floor(unlocks / 2);
  const halfHearts = unlocks % 2;
  const emptyHearts =
    Math.ceil(totalAchievements / 2) - fullHearts - halfHearts;

  return (
    <div className={`hearts ${className}`}>
      {[...Array(fullHearts)].map((e, i) => {
        const classNames = classnames({
          full: true,
          flash: flashLatest && i === fullHearts - 1 && !halfHearts,
          sparkle
        });
        return <span className={classNames} key={i} />;
      })}
      {!!halfHearts && (
        <span
          className={classnames({
            half: true,
            flash: flashLatest,
            sparkle
          })}
        />
      )}
      {[...Array(emptyHearts)].map((e, i) => (
        <span key={i} />
      ))}
    </div>
  );
};

export default Hearts;
