import React from 'react';

const PropList = ({ object, grid = 3 }) => (
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
