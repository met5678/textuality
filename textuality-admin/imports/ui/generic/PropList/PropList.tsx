import React from 'react';

interface PropListProps {
  object: Record<string, any>;
  grid?: number;
}

const PropList: React.FC<PropListProps> = ({ object, grid = 3 }) => (
  <dl className="row">
    {Object.entries(object).map(([key, value]) => (
      <React.Fragment key={key}>
        <dt className={`col-${grid}`}>{key}</dt>
        <dd className={`col-${12 - grid}`}>{String(value)}</dd>
      </React.Fragment>
    ))}
  </dl>
);

export default PropList; 